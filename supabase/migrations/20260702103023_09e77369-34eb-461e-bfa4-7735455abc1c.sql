
-- 1) answers: restrict SELECT to own rows or same-room players
DROP POLICY IF EXISTS "Authenticated view answers" ON public.answers;
CREATE POLICY "View answers in own rooms" ON public.answers
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.game_players gp
      WHERE gp.room_id = answers.room_id AND gp.user_id = auth.uid()
    )
  );

-- 2) game_players: remove permissive self-UPDATE (score must go through RPC)
DROP POLICY IF EXISTS "Users update their own player row" ON public.game_players;

-- 3) user_achievements: remove self-INSERT (must be granted server-side)
DROP POLICY IF EXISTS "Users insert their achievements" ON public.user_achievements;

-- 4) SECURITY DEFINER RPC to submit answers and update score authoritatively
CREATE OR REPLACE FUNCTION public.submit_answer(
  p_room_id uuid,
  p_question_id uuid,
  p_selected_index int,
  p_response_ms int
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_room public.game_rooms%ROWTYPE;
  v_q public.questions%ROWTYPE;
  v_is_correct boolean;
  v_points int := 0;
  v_speed_bonus int;
  v_capped_ms int;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_response_ms IS NULL OR p_response_ms < 0 THEN p_response_ms := 0; END IF;

  SELECT * INTO v_room FROM public.game_rooms WHERE id = p_room_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;
  IF v_room.status <> 'in_progress' THEN RAISE EXCEPTION 'Room not active'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.game_players WHERE room_id = p_room_id AND user_id = v_user
  ) THEN
    RAISE EXCEPTION 'Not a player in this room';
  END IF;

  IF v_room.question_ids[v_room.current_question + 1] IS DISTINCT FROM p_question_id THEN
    RAISE EXCEPTION 'Not the current question';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.answers
    WHERE room_id = p_room_id AND user_id = v_user AND question_id = p_question_id
  ) THEN
    RAISE EXCEPTION 'Already answered';
  END IF;

  SELECT * INTO v_q FROM public.questions WHERE id = p_question_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Question not found'; END IF;

  v_is_correct := (p_selected_index IS NOT NULL AND p_selected_index >= 0 AND p_selected_index = v_q.correct_index);

  IF v_is_correct THEN
    v_capped_ms := LEAST(p_response_ms, v_room.time_per_question * 1000);
    v_speed_bonus := FLOOR(100.0 * ((v_room.time_per_question * 1000 - v_capped_ms)::numeric / (v_room.time_per_question * 1000)));
    v_points := 100 + v_speed_bonus;
    IF v_q.is_bonus THEN v_points := v_points * 2; END IF;
  END IF;

  INSERT INTO public.answers (room_id, user_id, question_id, selected_index, is_correct, points_earned, response_time_ms)
  VALUES (
    p_room_id, v_user, p_question_id,
    CASE WHEN p_selected_index IS NULL OR p_selected_index < 0 THEN NULL ELSE p_selected_index END,
    v_is_correct, v_points, p_response_ms
  );

  UPDATE public.game_players
    SET score = score + v_points,
        correct_count = correct_count + (CASE WHEN v_is_correct THEN 1 ELSE 0 END),
        wrong_count  = wrong_count  + (CASE WHEN NOT v_is_correct AND p_selected_index IS NOT NULL AND p_selected_index >= 0 THEN 1 ELSE 0 END)
    WHERE room_id = p_room_id AND user_id = v_user;

  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_index', v_q.correct_index,
    'points_earned', v_points
  );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_answer(uuid, uuid, int, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_answer(uuid, uuid, int, int) TO authenticated;

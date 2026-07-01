import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { calculateScore, shuffle } from "@/lib/game";
import { Copy, Loader2, Users, Crown, Zap, Check, X, Trophy } from "lucide-react";

type Room = {
  id: string; code: string; host_id: string;
  category_id: string | null; difficulty: string | null;
  question_count: number; time_per_question: number; max_players: number;
  status: "waiting" | "in_progress" | "finished";
  question_ids: string[]; current_question: number;
  question_started_at: string | null; is_solo: boolean;
};
type Player = { id: string; user_id: string; score: number; correct_count: number; wrong_count: number; profile?: { username: string; avatar_url: string | null } | null };
type Question = { id: string; question: string; choices: string[]; correct_index: number; is_bonus: boolean; type: string };

export const Route = createFileRoute("/_authenticated/room/$code")({
  component: RoomPage,
});

function RoomPage() {
  const { code } = Route.useParams();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load + join
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: r, error } = await supabase.from("game_rooms").select("*").eq("code", code).maybeSingle();
      if (error || !r) { toast.error("Room not found"); navigate({ to: "/dashboard" }); return; }
      if (cancelled) return;
      setRoom(r as Room);
      // Ensure joined (skip solo — host already inserted)
      const { data: existing } = await supabase.from("game_players").select("id").eq("room_id", r.id).eq("user_id", user.id).maybeSingle();
      if (!existing && r.status === "waiting") {
        const { count } = await supabase.from("game_players").select("*", { count: "exact", head: true }).eq("room_id", r.id);
        if ((count ?? 0) >= r.max_players) { toast.error("Room is full"); navigate({ to: "/dashboard" }); return; }
        await supabase.from("game_players").insert({ room_id: r.id, user_id: user.id });
      }
      await refreshPlayers(r.id);
      setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const refreshPlayers = async (roomId: string) => {
    const { data } = await supabase.from("game_players")
      .select("id, user_id, score, correct_count, wrong_count, profiles(username, avatar_url)")
      .eq("room_id", roomId).order("score", { ascending: false });
    setPlayers((data ?? []).map((p: any) => ({ ...p, profile: p.profiles })));
  };

  // Realtime subscriptions
  useEffect(() => {
    if (!room) return;
    const ch = supabase.channel(`room-${room.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "game_rooms", filter: `id=eq.${room.id}` },
        (payload) => setRoom(payload.new as Room))
      .on("postgres_changes", { event: "*", schema: "public", table: "game_players", filter: `room_id=eq.${room.id}` },
        () => refreshPlayers(room.id))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [room?.id]);

  if (loading || !room) {
    return <main className="mx-auto max-w-4xl px-4 py-20 flex items-center justify-center">
      <Loader2 className="animate-spin size-8 text-primary" />
    </main>;
  }

  if (room.status === "waiting") return <WaitingRoom room={room} players={players} isHost={room.host_id === user.id} userId={user.id} />;
  if (room.status === "in_progress") return <GameScreen room={room} players={players} userId={user.id} isHost={room.host_id === user.id} onRefreshPlayers={() => refreshPlayers(room.id)} />;
  return <ResultsScreen room={room} players={players} userId={user.id} />;
}

/* ----------------- WAITING ----------------- */
function WaitingRoom({ room, players, isHost, userId }: { room: Room; players: Player[]; isHost: boolean; userId: string }) {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const copy = () => { navigator.clipboard.writeText(room.code); toast.success("Code copied!"); };
  const share = async () => {
    const url = `${window.location.origin}/room/${room.code}`;
    if (navigator.share) { try { await navigator.share({ title: "Join my trivia room", text: `Room code: ${room.code}`, url }); } catch { /* ignored */ } }
    else { await navigator.clipboard.writeText(url); toast.success("Link copied!"); }
  };

  const leave = async () => {
    await supabase.from("game_players").delete().eq("room_id", room.id).eq("user_id", userId);
    navigate({ to: "/dashboard" });
  };

  const startGame = async () => {
    setStarting(true);
    try {
      let q = supabase.from("questions").select("id").eq("approved", true);
      if (room.category_id) q = q.eq("category_id", room.category_id);
      if (room.difficulty) q = q.eq("difficulty", room.difficulty as any);
      const { data: qs, error } = await q.limit(200);
      if (error) throw error;
      if (!qs || qs.length === 0) { toast.error("No questions match"); return; }
      const picked = shuffle(qs).slice(0, room.question_count).map(x => x.id);
      const { error: uErr } = await supabase.from("game_rooms").update({
        status: "in_progress",
        question_ids: picked,
        current_question: 0,
        question_started_at: new Date().toISOString(),
      }).eq("id", room.id);
      if (uErr) throw uErr;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start");
    } finally { setStarting(false); }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="card-pop p-8 animate-pop-in text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Room code</p>
        <div className="mt-3 inline-flex items-center gap-3">
          <div className="font-display text-6xl md:text-7xl font-bold tracking-[0.2em] bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
            {room.code}
          </div>
          <Button size="icon" variant="ghost" onClick={copy} className="rounded-full"><Copy className="size-5" /></Button>
        </div>
        <p className="mt-2 text-muted-foreground">Share this code with friends to join.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button onClick={share} variant="outline" className="btn-pop rounded-full">Share link</Button>
          <Button onClick={leave} variant="ghost" className="btn-pop rounded-full">Leave room</Button>
        </div>

        <div className="mt-8 text-left">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Users className="size-4" /> Players ({players.length}/{room.max_players})
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-muted p-3">
                <div className="size-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white grid place-items-center font-bold">
                  {(p.profile?.username ?? "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 font-semibold">{p.profile?.username ?? "player"}</div>
                {p.user_id === room.host_id && <Crown className="size-4 text-warning-foreground" />}
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <Button onClick={startGame} disabled={starting || players.length < 1}
            className="btn-pop mt-8 rounded-full h-12 px-8 bg-primary text-primary-foreground font-bold text-base">
            {starting ? <Loader2 className="animate-spin size-5" /> : "Start game"}
          </Button>
        )}
        {!isHost && (
          <p className="mt-8 text-sm text-muted-foreground">Waiting for host to start…</p>
        )}
      </div>
    </main>
  );
}

/* ----------------- GAME ----------------- */
function GameScreen({ room, players, userId, isHost, onRefreshPlayers }: {
  room: Room; players: Player[]; userId: string; isHost: boolean; onRefreshPlayers: () => void;
}) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(room.time_per_question);
  const startAtRef = useRef<number>(Date.now());
  const currentQid = room.question_ids[room.current_question];

  // Fetch current question
  useEffect(() => {
    setSelected(null); setLocked(false);
    startAtRef.current = room.question_started_at ? new Date(room.question_started_at).getTime() : Date.now();
    (async () => {
      const { data, error } = await supabase.from("questions")
        .select("id, question, choices, correct_index, is_bonus, type").eq("id", currentQid).maybeSingle();
      if (error || !data) return;
      // Randomize choice order but keep track of correct
      const choicesArr: string[] = Array.isArray(data.choices) ? (data.choices as string[]) : (data.choices as any);
      const indices = choicesArr.map((_, i) => i);
      const shuffled = shuffle(indices);
      const newChoices = shuffled.map(i => choicesArr[i]);
      const newCorrect = shuffled.indexOf(data.correct_index);
      setQuestion({ ...data, choices: newChoices, correct_index: newCorrect } as Question);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQid, room.question_started_at]);

  // Timer
  useEffect(() => {
    const iv = setInterval(() => {
      const elapsed = (Date.now() - startAtRef.current) / 1000;
      const r = Math.max(0, Math.ceil(room.time_per_question - elapsed));
      setRemaining(r);
      if (r <= 0 && !locked) { setLocked(true); if (selected === null) recordAnswer(-1); }
    }, 200);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.time_per_question, room.question_started_at, locked, selected]);

  // Auto-advance for host after time is up + small buffer
  useEffect(() => {
    if (!isHost) return;
    const timeoutMs = (room.time_per_question + 3) * 1000;
    const t = setTimeout(async () => {
      const isLast = room.current_question + 1 >= room.question_ids.length;
      if (isLast) {
        await supabase.from("game_rooms").update({ status: "finished" }).eq("id", room.id);
        // Update host stats too
        await bumpProfileStatsFromRoom(room.id);
      } else {
        await supabase.from("game_rooms").update({
          current_question: room.current_question + 1,
          question_started_at: new Date().toISOString(),
        }).eq("id", room.id);
      }
    }, timeoutMs);
    return () => clearTimeout(t);
  }, [isHost, room.current_question, room.id, room.question_ids.length, room.question_started_at, room.time_per_question]);

  const recordAnswer = async (choice: number) => {
    if (!question) return;
    const responseMs = Math.min(room.time_per_question * 1000, Date.now() - startAtRef.current);
    const isCorrect = choice === question.correct_index;
    const points = calculateScore({ isCorrect, responseMs, timeLimitSec: room.time_per_question, isBonus: question.is_bonus });
    const { error } = await supabase.from("answers").insert({
      room_id: room.id, user_id: userId, question_id: question.id,
      selected_index: choice < 0 ? null : choice, is_correct: isCorrect,
      points_earned: points, response_time_ms: Math.round(responseMs),
    });
    if (error && !error.message.includes("duplicate")) { toast.error("Failed to record"); return; }

    // Update player row (increment)
    const me = players.find(p => p.user_id === userId);
    await supabase.from("game_players").update({
      score: (me?.score ?? 0) + points,
      correct_count: (me?.correct_count ?? 0) + (isCorrect ? 1 : 0),
      wrong_count: (me?.wrong_count ?? 0) + (!isCorrect && choice >= 0 ? 1 : 0),
    }).eq("room_id", room.id).eq("user_id", userId);
    onRefreshPlayers();
  };

  const pick = (i: number) => {
    if (locked || selected !== null) return;
    setSelected(i); setLocked(true);
    recordAnswer(i);
  };

  const pct = Math.max(0, Math.min(100, (remaining / room.time_per_question) * 100));

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
        <div>Question {room.current_question + 1} / {room.question_ids.length}</div>
        <div className="flex items-center gap-1"><Zap className="size-4 text-warning-foreground" /> {remaining}s</div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${pct}%` }} />
      </div>

      {!question ? (
        <div className="mt-10 flex justify-center"><Loader2 className="animate-spin size-6 text-primary" /></div>
      ) : (
        <div className="card-pop mt-5 p-6 md:p-8 animate-pop-in">
          {question.is_bonus && (
            <div className="inline-flex items-center gap-1 rounded-full bg-warning/30 text-warning-foreground px-3 py-1 text-xs font-bold uppercase mb-3">
              Bonus • 2x points
            </div>
          )}
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">{question.question}</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {question.choices.map((c, i) => {
              const revealed = locked;
              const isRight = i === question.correct_index;
              const isPicked = selected === i;
              return (
                <button key={i} onClick={() => pick(i)} disabled={locked}
                  className={`btn-pop text-left rounded-2xl p-4 border-2 font-semibold flex items-center gap-3 ${
                    !revealed ? "border-border bg-card hover:border-primary" :
                    isRight ? "border-success bg-success/15" :
                    isPicked ? "border-destructive bg-destructive/15" : "border-border bg-card opacity-70"
                  }`}>
                  <span className="size-7 rounded-full bg-muted grid place-items-center text-sm">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{c}</span>
                  {revealed && isRight && <Check className="size-5 text-success" />}
                  {revealed && !isRight && isPicked && <X className="size-5 text-destructive" />}
                </button>
              );
            })}
          </div>
          {locked && (
            <p className="mt-4 text-sm text-muted-foreground text-center">
              {isHost ? "Next question in a moment…" : "Waiting for host…"}
            </p>
          )}
        </div>
      )}

      <div className="card-pop mt-5 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Live standings</div>
        <div className="grid gap-1.5">
          {players.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-3 rounded-xl p-2 ${p.user_id === userId ? "bg-accent" : ""}`}>
              <div className="w-6 text-center font-display font-bold text-muted-foreground">{i + 1}</div>
              <div className="size-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white grid place-items-center font-bold text-xs">
                {(p.profile?.username ?? "?").slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 font-semibold text-sm">{p.profile?.username ?? "player"}</div>
              <div className="font-display font-bold">{p.score}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ----------------- RESULTS ----------------- */
function ResultsScreen({ room, players, userId }: { room: Room; players: Player[]; userId: string }) {
  const navigate = useNavigate();
  const winner = players[0];
  const me = players.find(p => p.user_id === userId);
  const accuracy = me ? Math.round(((me.correct_count) / Math.max(1, me.correct_count + me.wrong_count)) * 100) : 0;

  useEffect(() => {
    // Fire stat bump once for non-host (host bumped from advance). Idempotent enough for MVP.
    if (room.host_id !== userId) bumpProfileStatsFromRoom(room.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="card-pop p-8 md:p-10 text-center animate-pop-in">
        <Trophy className="size-14 mx-auto text-warning-foreground" />
        <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Winner</p>
        <h1 className="mt-1 font-display text-4xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
          {winner?.profile?.username ?? "—"}
        </h1>
        <div className="mt-1 font-display text-2xl">{winner?.score ?? 0} pts</div>

        {me && (
          <div className="mt-8 grid grid-cols-3 gap-3">
            <MiniStat label="Your score" value={me.score} />
            <MiniStat label="Accuracy" value={`${accuracy}%`} />
            <MiniStat label="Correct" value={`${me.correct_count}/${me.correct_count + me.wrong_count}`} />
          </div>
        )}

        <div className="mt-8 text-left">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Final standings</div>
          <div className="grid gap-1.5">
            {players.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 rounded-xl p-3 ${p.user_id === userId ? "bg-accent" : "bg-muted"}`}>
                <div className="w-6 text-center font-display font-bold">{i + 1}</div>
                <div className="flex-1 font-semibold">{p.profile?.username}</div>
                <div className="font-display font-bold">{p.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          <Button onClick={() => navigate({ to: "/dashboard" })} className="btn-pop rounded-full bg-primary text-primary-foreground font-bold">
            Back to home
          </Button>
          <Button onClick={() => navigate({ to: "/leaderboard" })} variant="outline" className="btn-pop rounded-full">
            View leaderboard
          </Button>
        </div>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <div className="text-2xl font-display font-bold text-primary">{value}</div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}

/* Update the current user's profile with game outcome. Idempotent-ish for MVP. */
async function bumpProfileStatsFromRoom(roomId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: gp } = await supabase.from("game_players")
    .select("score, correct_count, wrong_count").eq("room_id", roomId).eq("user_id", user.id).maybeSingle();
  if (!gp) return;
  const { data: all } = await supabase.from("game_players").select("user_id, score").eq("room_id", roomId).order("score", { ascending: false });
  const isWinner = all?.[0]?.user_id === user.id;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) return;
  await supabase.from("profiles").update({
    total_points: profile.total_points + gp.score,
    games_played: profile.games_played + 1,
    games_won: profile.games_won + (isWinner ? 1 : 0),
    correct_answers: profile.correct_answers + gp.correct_count,
    wrong_answers: profile.wrong_answers + gp.wrong_count,
    best_score: Math.max(profile.best_score, gp.score),
  }).eq("id", user.id);
}

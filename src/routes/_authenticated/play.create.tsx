import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateRoomCode } from "@/lib/game";
import { generateCustomQuestions } from "@/lib/questions.functions";
import { toast } from "sonner";
import { Loader2, Users, Library, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/play/create")({
  component: CreateRoom,
});

type Difficulty = "easy" | "medium" | "hard" | "mixed";
type Mode = "library" | "ai";

const TOPIC_SUGGESTIONS = [
  "כדורגל ישראלי",
  "חלל וכוכבים",
  "היסטוריה של ירושלים",
  "סרטי דיסני",
  "בישול ואוכל",
  "מוזיקה ישראלית",
];

function CreateRoom() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const generateFn = useServerFn(generateCustomQuestions);

  const [mode, setMode] = useState<Mode>("library");
  const [categoryId, setCategoryId] = useState<string>("any");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [count, setCount] = useState(10);
  const [time, setTime] = useState(20);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<"idle" | "generating" | "creating">("idle");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id,name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const create = async () => {
    if (mode === "ai" && topic.trim().length < 2) {
      toast.error("הזינו נושא לשאלות");
      return;
    }
    setBusy(true);
    try {
      let questionIds: string[] = [];
      if (mode === "ai") {
        setStage("generating");
        const res = await generateFn({ data: { topic: topic.trim(), difficulty, count } });
        questionIds = res.question_ids;
        if (questionIds.length === 0) throw new Error("לא נוצרו שאלות");
      }

      setStage("creating");
      const code = generateRoomCode();
      const { data: room, error } = await supabase.from("game_rooms").insert({
        code, host_id: user.id,
        category_id: mode === "library" && categoryId !== "any" ? categoryId : null,
        difficulty: difficulty === "mixed" ? null : difficulty,
        question_count: count,
        time_per_question: time,
        max_players: maxPlayers,
        is_solo: false,
        status: "waiting",
        question_ids: questionIds,
      }).select("id, code").single();
      if (error) throw error;
      await supabase.from("game_players").insert({ room_id: room.id, user_id: user.id });
      navigate({ to: "/room/$code", params: { code: room.code } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "יצירת החדר נכשלה");
    } finally {
      setBusy(false);
      setStage("idle");
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="card-pop p-8 animate-pop-in">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-secondary to-pink text-white shadow-lg">
          <Users className="size-6" />
        </div>
        <h1 className="font-display text-3xl font-bold mt-4">יצירת חדר</h1>
        <p className="text-muted-foreground mt-1">בחרו מקור לשאלות והמשיכו להגדרות המשחק.</p>

        {/* Mode toggle */}
        <div className="mt-6 grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-muted">
          <ModeButton active={mode === "library"} onClick={() => setMode("library")} icon={<Library className="size-4" />} label="ממאגר השאלות" />
          <ModeButton active={mode === "ai"} onClick={() => setMode("ai")} icon={<Sparkles className="size-4" />} label="צרו שאלות עם AI" badge="חדש" />
        </div>

        <div className="mt-6 grid gap-5">
          {mode === "library" ? (
            <Field label="קטגוריה">
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="rounded-full h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">כל קטגוריה</SelectItem>
                  {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-secondary/50 bg-secondary/5 p-4">
              <Field label="על איזה נושא תרצו לשחק?">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="לדוגמה: כדורגל ישראלי, חלל, סרטי דיסני…"
                  maxLength={120}
                  className="rounded-full h-11 bg-card"
                />
              </Field>
              <div className="mt-3 flex flex-wrap gap-2">
                {TOPIC_SUGGESTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className="btn-pop text-xs font-semibold rounded-full px-3 py-1.5 bg-card border border-border hover:border-secondary hover:bg-secondary/10 transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-secondary" />
                השאלות ייווצרו במיוחד עבורכם, בעברית, לפי הנושא ורמת הקושי.
              </p>
            </div>
          )}

          <Field label="רמת קושי">
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <SelectTrigger className="rounded-full h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">מעורב</SelectItem>
                <SelectItem value="easy">קל</SelectItem>
                <SelectItem value="medium">בינוני</SelectItem>
                <SelectItem value="hard">קשה</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={`שאלות: ${count}`}>
            <Slider value={[count]} min={5} max={20} step={1} onValueChange={([v]) => setCount(v)} />
          </Field>
          <Field label={`זמן לשאלה: ${time} שנ׳`}>
            <Slider value={[time]} min={10} max={45} step={5} onValueChange={([v]) => setTime(v)} />
          </Field>
          <Field label={`מקסימום שחקנים: ${maxPlayers}`}>
            <Slider value={[maxPlayers]} min={2} max={12} step={1} onValueChange={([v]) => setMaxPlayers(v)} />
          </Field>

          <Button onClick={create} disabled={busy || (mode === "ai" && topic.trim().length < 2)}
            className="btn-pop rounded-full h-12 bg-primary text-primary-foreground text-base font-bold">
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin size-5" />
                {stage === "generating" ? "יוצרים שאלות עם AI…" : "פותחים חדר…"}
              </span>
            ) : mode === "ai" ? (
              <span className="inline-flex items-center gap-2"><Sparkles className="size-5" /> צרו שאלות ופתחו חדר</span>
            ) : (
              "צרו חדר"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

function ModeButton({ active, onClick, icon, label, badge }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-pop rounded-xl h-11 px-3 text-sm font-bold flex items-center justify-center gap-2 transition ${
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-secondary to-pink text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

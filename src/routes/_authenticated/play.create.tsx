import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateRoomCode } from "@/lib/game";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/play/create")({
  component: CreateRoom,
});

type Difficulty = "easy" | "medium" | "hard" | "mixed";

function CreateRoom() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState<string>("any");
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [count, setCount] = useState(10);
  const [time, setTime] = useState(20);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [busy, setBusy] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id,name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const create = async () => {
    setBusy(true);
    try {
      const code = generateRoomCode();
      const { data: room, error } = await supabase.from("game_rooms").insert({
        code, host_id: user.id,
        category_id: categoryId === "any" ? null : categoryId,
        difficulty: difficulty === "mixed" ? null : difficulty,
        question_count: count,
        time_per_question: time,
        max_players: maxPlayers,
        is_solo: false,
        status: "waiting",
      }).select("id, code").single();
      if (error) throw error;
      await supabase.from("game_players").insert({ room_id: room.id, user_id: user.id });
      navigate({ to: "/room/$code", params: { code: room.code } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "יצירת החדר נכשלה");
    } finally { setBusy(false); }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="card-pop p-8 animate-pop-in">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-secondary to-pink text-white shadow-lg">
          <Users className="size-6" />
        </div>
        <h1 className="font-display text-3xl font-bold mt-4">יצירת חדר</h1>
        <p className="text-muted-foreground mt-1">תקבלו קוד לשיתוף ברגע שהחדר יהיה מוכן.</p>

        <div className="mt-6 grid gap-5">
          <Field label="קטגוריה">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="rounded-full h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">כל קטגוריה</SelectItem>
                {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
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
          <Button onClick={create} disabled={busy}
            className="btn-pop rounded-full h-12 bg-primary text-primary-foreground text-base font-bold">
            {busy ? <Loader2 className="animate-spin size-5" /> : "צרו חדר"}
          </Button>
        </div>
      </div>
    </main>
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

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User as UserIcon, Trophy, Target, Flame, Zap, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [username, setUsername] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => { if (profile?.username) setUsername(profile.username); }, [profile?.username]);

  const { data: achievements } = useQuery({
    queryKey: ["achievements", user.id],
    queryFn: async () => {
      const [all, mine] = await Promise.all([
        supabase.from("achievements").select("*"),
        supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
      ]);
      const unlocked = new Set((mine.data ?? []).map(x => x.achievement_id));
      return (all.data ?? []).map(a => ({ ...a, unlocked: unlocked.has(a.id) }));
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (clean.length < 3) throw new Error("At least 3 chars, letters/digits/_");
      const { error } = await supabase.from("profiles").update({ username: clean }).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["profile"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to save"),
  });

  if (isLoading) return <main className="p-10 flex justify-center"><Loader2 className="animate-spin size-6 text-primary" /></main>;

  const accuracy = profile ? Math.round((profile.correct_answers / Math.max(1, profile.correct_answers + profile.wrong_answers)) * 100) : 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="card-pop p-6 md:p-8 animate-pop-in flex items-center gap-5">
        <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white grid place-items-center font-display font-bold text-3xl shadow-lg">
          {(profile?.username ?? "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Profile</div>
          <h1 className="font-display text-3xl font-bold">{profile?.username}</h1>
          <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={<Trophy />} label="Total points" value={profile?.total_points ?? 0} />
        <Stat icon={<Target />} label="Games won" value={profile?.games_won ?? 0} />
        <Stat icon={<Zap />} label="Accuracy" value={`${accuracy}%`} />
        <Stat icon={<Flame />} label="Games played" value={profile?.games_played ?? 0} />
      </div>

      <div className="card-pop p-6">
        <h2 className="font-display text-xl font-bold flex items-center gap-2"><UserIcon className="size-5" /> Update username</h2>
        <div className="mt-4 flex gap-2">
          <div className="flex-1">
            <Label className="sr-only">Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-full h-11" />
          </div>
          <Button onClick={() => save.mutate()} disabled={save.isPending} className="btn-pop rounded-full h-11 px-6 bg-primary text-primary-foreground font-bold">
            {save.isPending ? <Loader2 className="animate-spin size-4" /> : "Save"}
          </Button>
        </div>
      </div>

      <div className="card-pop p-6">
        <h2 className="font-display text-xl font-bold">Achievements</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {achievements?.map(a => (
            <div key={a.id} className={`rounded-2xl p-4 border-2 ${a.unlocked ? "border-success bg-success/10" : "border-border bg-muted opacity-60"}`}>
              <div className="font-display font-bold">{a.name}</div>
              <div className="text-sm text-muted-foreground">{a.description}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="card-pop p-4">
      <div className="inline-flex items-center justify-center size-9 rounded-xl bg-primary/10 text-primary">{icon}</div>
      <div className="mt-2 text-2xl font-display font-bold">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

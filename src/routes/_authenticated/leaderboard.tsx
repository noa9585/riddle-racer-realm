import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  component: Leaderboard,
});

function Leaderboard() {
  const { user } = Route.useRouteContext();

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles")
        .select("id, username, avatar_url, total_points, games_won, games_played")
        .order("total_points", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3 animate-pop-in">
        <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-warning to-secondary text-white shadow-lg">
          <Trophy className="size-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Global leaderboard</h1>
          <p className="text-muted-foreground text-sm">Top 100 players by total points</p>
        </div>
      </div>

      <div className="card-pop mt-6 p-2">
        {isLoading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin size-6 text-primary" /></div>
        ) : (
          <div className="divide-y divide-border">
            {data?.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 p-3 ${p.id === user.id ? "bg-accent rounded-2xl" : ""}`}>
                <div className={`w-10 text-center font-display font-bold text-lg ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <div className="size-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white grid place-items-center font-bold">
                  {(p.username ?? "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{p.username}</div>
                  <div className="text-xs text-muted-foreground">{p.games_won} wins · {p.games_played} games</div>
                </div>
                <div className="font-display font-bold text-lg">{p.total_points}</div>
              </div>
            ))}
            {data?.length === 0 && (
              <div className="p-10 text-center text-muted-foreground">Be the first to play and top the board!</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

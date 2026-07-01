import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Users, LogIn, Trophy, Target, Flame } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();

  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="animate-pop-in">
        <p className="text-sm text-muted-foreground font-semibold">ברוכים השבים</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold">
          היי <span className="text-primary">{profile?.username ?? "שחקן"}</span> 👋
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Trophy className="size-5" />} label="סה״כ נקודות" value={profile?.total_points ?? 0} tint="primary" />
        <StatCard icon={<Target className="size-5" />} label="ניצחונות" value={profile?.games_won ?? 0} tint="success" />
        <StatCard icon={<Flame className="size-5" />} label="רצף שיא" value={profile?.longest_streak ?? 0} tint="secondary" />
        <StatCard icon={<Zap className="size-5" />} label="תשובות נכונות" value={profile?.correct_answers ?? 0} tint="warning" />
      </div>

      <section className="mt-10 grid md:grid-cols-3 gap-5">
        <PlayCard to="/play/solo" title="אימון סולו" body="שחקו מיד נגד השעון." icon={<Zap className="size-6" />}
          gradient="from-primary to-violet" cta="התחילו סולו" />
        <PlayCard to="/play/create" title="יצירת חדר" body="ארחו חברים ובחרו את הכללים." icon={<Users className="size-6" />}
          gradient="from-secondary to-pink" cta="צרו חדר" />
        <PlayCard to="/play/join" title="הצטרפות לחדר" body="יש לכם קוד בן 6 אותיות? קפצו פנימה." icon={<LogIn className="size-6" />}
          gradient="from-success to-lime" cta="הזינו קוד" />
      </section>
    </main>
  );
}

function StatCard({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: number; tint: string }) {
  const map: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    secondary: "bg-secondary/15 text-secondary",
    warning: "bg-warning/20 text-warning-foreground",
  };
  return (
    <div className="card-pop p-4">
      <div className={`inline-flex items-center justify-center size-9 rounded-xl ${map[tint]}`}>{icon}</div>
      <div className="mt-3 text-2xl font-display font-bold">{value}</div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}

function PlayCard({ to, title, body, icon, gradient, cta }: { to: string; title: string; body: string; icon: React.ReactNode; gradient: string; cta: string }) {
  return (
    <Link to={to} className="card-pop p-6 group hover:-translate-y-1 transition-transform">
      <div className={`inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>{icon}</div>
      <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground mt-1">{body}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
        {cta} <span className="group-hover:-translate-x-1 transition-transform">←</span>
      </div>
    </Link>
  );
}

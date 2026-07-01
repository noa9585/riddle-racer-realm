import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles, LogOut, Trophy, User as UserIcon, Home } from "lucide-react";

export function AppHeader() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-display font-bold text-xl">
          <span className="inline-flex items-center justify-center size-9 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg">
            <Sparkles className="size-5" />
          </span>
          טריוויה פופ
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/dashboard" icon={<Home className="size-4" />} label="שחקו" />
          <NavLink to="/leaderboard" icon={<Trophy className="size-4" />} label="לוח מובילים" />
          <NavLink to="/profile" icon={<UserIcon className="size-4" />} label="פרופיל" />
        </nav>
        <Button variant="ghost" size="sm" onClick={signOut} className="btn-pop rounded-full">
          <LogOut className="size-4" /> <span className="hidden sm:inline">התנתקות</span>
        </Button>
      </div>
    </header>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="px-3 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2"
      activeProps={{ className: "!text-primary bg-accent" }}
    >
      {icon} {label}
    </Link>
  );
}

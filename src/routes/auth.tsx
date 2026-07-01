import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("הזינו כתובת אימייל תקינה").max(255),
  password: z.string().min(6, "לפחות 6 תווים").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
        toast.success("ברוכים הבאים! נכנסתם.");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email, password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("התחברת בהצלחה");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "משהו השתבש");
    } finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("התחברות עם Google נכשלה"); setBusy(false); return; }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl justify-center mb-6">
          <span className="inline-flex items-center justify-center size-9 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg">
            <Sparkles className="size-5" />
          </span>
          טריוויה פופ
        </Link>

        <div className="card-pop p-8 animate-pop-in">
          <h1 className="font-display text-2xl font-bold text-center">
            {mode === "signin" ? "ברוכים השבים" : "יצירת חשבון"}
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "התחברו כדי להמשיך לשחק" : "התחילו לטפס בלוח המובילים"}
          </p>

          <Button type="button" onClick={google} disabled={busy}
            className="btn-pop mt-6 w-full rounded-full h-11 bg-card border border-border text-foreground hover:bg-muted">
            <GoogleIcon /> המשיכו עם Google
          </Button>

          <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground uppercase font-semibold">
            <span className="h-px flex-1 bg-border" /> או אימייל <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">אימייל</Label>
              <Input id="email" type="email" autoComplete="email" required dir="ltr"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="rounded-full h-11 mt-1" />
            </div>
            <div>
              <Label htmlFor="password">סיסמה</Label>
              <Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required dir="ltr"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="rounded-full h-11 mt-1" />
            </div>
            <Button type="submit" disabled={busy}
              className="btn-pop w-full rounded-full h-11 bg-primary text-primary-foreground font-bold text-base">
              {busy ? <Loader2 className="animate-spin size-4" /> : (mode === "signin" ? "התחברות" : "יצירת חשבון")}
            </Button>
          </form>

          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">
            {mode === "signin" ? "אין חשבון? הירשמו" : "כבר יש חשבון? התחברו"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.52H2.17v2.84C3.98 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.85 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.17C1.42 8.55 1 10.22 1 12s.42 3.45 1.17 4.95l3.68-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.98 3.47 2.17 7.05L5.85 9.9C6.72 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

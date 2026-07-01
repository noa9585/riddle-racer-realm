import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Users, Zap, Trophy, Brain } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold text-xl">
          <span className="inline-flex items-center justify-center size-9 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg">
            <Sparkles className="size-5" />
          </span>
          Trivia Pop
        </div>
        <Link to="/auth" className="btn-pop rounded-full px-5 py-2 bg-card border border-border font-semibold">
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-12 pb-24">
        <section className="text-center animate-pop-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            <span className="size-2 rounded-full bg-success animate-pulse" /> Live multiplayer trivia
          </div>
          <h1 className="mt-6 font-display font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight">
            Trivia that <span className="bg-gradient-to-br from-primary via-secondary to-warning bg-clip-text text-transparent">pops</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Play solo, spin up a private room, and challenge friends across any device. Real‑time scoring, fast questions, no fluff.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/auth" className="btn-pop rounded-full bg-primary text-primary-foreground px-8 py-3.5 font-bold text-lg shadow-xl shadow-primary/30">
              Start playing free
            </Link>
            <Link to="/auth" className="btn-pop rounded-full bg-card border border-border px-8 py-3.5 font-bold text-lg">
              Join a room
            </Link>
          </div>
        </section>

        <section className="mt-24 grid md:grid-cols-3 gap-5">
          <Feature icon={<Zap className="size-6" />} title="Real-time battles" tint="from-primary/20 to-secondary/20"
            body="Everyone gets the same question at the same moment. Faster answers score more." />
          <Feature icon={<Users className="size-6" />} title="Private rooms" tint="from-secondary/20 to-warning/20"
            body="Create a 6-letter room code and invite friends across devices in one tap." />
          <Feature icon={<Trophy className="size-6" />} title="Live leaderboard" tint="from-success/25 to-primary/20"
            body="Climb daily, weekly, and all-time boards. Unlock achievements as you play." />
        </section>

        <section className="mt-24 card-pop p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Brain className="size-10 text-primary" />
            <h2 className="mt-4 text-3xl md:text-4xl font-display font-bold">Built for pace.</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              A countdown clock. Bonus questions worth double. Speed bonuses that reward the fastest brains. Every game feels like a race.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Categories" value="8+" />
            <Stat label="Question types" value="MC + T/F" />
            <Stat label="Max players / room" value="8" />
            <Stat label="Time per question" value="~20s" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground text-center">
          Made with playful chaos • © {new Date().getFullYear()} Trivia Pop
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, body, tint }: { icon: React.ReactNode; title: string; body: string; tint: string }) {
  return (
    <div className="card-pop p-6">
      <div className={`inline-flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br ${tint} text-primary`}>
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-display font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{body}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <div className="text-2xl font-display font-bold text-primary">{value}</div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1 font-semibold">{label}</div>
    </div>
  );
}

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
          טריוויה פופ
        </div>
        <Link to="/auth" className="btn-pop rounded-full px-5 py-2 bg-card border border-border font-semibold">
          התחברות
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-12 pb-24">
        <section className="text-center animate-pop-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            <span className="size-2 rounded-full bg-success animate-pulse" /> טריוויה מרובת משתתפים בזמן אמת
          </div>
          <h1 className="mt-6 font-display font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight">
            טריוויה ש<span className="bg-gradient-to-br from-primary via-secondary to-warning bg-clip-text text-transparent">קופצת</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            שחקו לבד, פתחו חדר פרטי ואתגרו חברים מכל מכשיר. ניקוד בזמן אמת, שאלות מהירות, בלי בלבולי מוח.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/auth" className="btn-pop rounded-full bg-primary text-primary-foreground px-8 py-3.5 font-bold text-lg shadow-xl shadow-primary/30">
              התחילו לשחק בחינם
            </Link>
            <Link to="/auth" className="btn-pop rounded-full bg-card border border-border px-8 py-3.5 font-bold text-lg">
              הצטרפו לחדר
            </Link>
          </div>
        </section>

        <section className="mt-24 grid md:grid-cols-3 gap-5">
          <Feature icon={<Zap className="size-6" />} title="קרבות בזמן אמת" tint="from-primary/20 to-secondary/20"
            body="כולם מקבלים את אותה שאלה באותו רגע. תשובות מהירות = יותר נקודות." />
          <Feature icon={<Users className="size-6" />} title="חדרים פרטיים" tint="from-secondary/20 to-warning/20"
            body="צרו קוד חדר בן 6 אותיות והזמינו חברים מכל מכשיר בלחיצה." />
          <Feature icon={<Trophy className="size-6" />} title="לוח מובילים חי" tint="from-success/25 to-primary/20"
            body="טפסו בטבלאות היומיות, השבועיות והכל־זמניות. פתחו הישגים תוך כדי משחק." />
        </section>

        <section className="mt-24 card-pop p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Brain className="size-10 text-primary" />
            <h2 className="mt-4 text-3xl md:text-4xl font-display font-bold">בנוי למהירות.</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              שעון ספירה לאחור. שאלות בונוס בכפול נקודות. בונוסי מהירות שמתגמלים את המוחות המהירים. כל משחק מרגיש כמו מרוץ.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="קטגוריות" value="8+" />
            <Stat label="סוגי שאלות" value="רב־ברירה + נכון/לא" />
            <Stat label="שחקנים בחדר" value="עד 8" />
            <Stat label="זמן לשאלה" value="~20 שנ׳" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground text-center">
          נבנה בכיף שובבי • © {new Date().getFullYear()} טריוויה פופ
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

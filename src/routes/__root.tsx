import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-pop max-w-md text-center p-10 animate-pop-in">
        <div className="text-7xl font-display font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
          404
        </div>
        <h2 className="mt-4 text-xl font-display font-semibold">הדף לא נמצא</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          נראה שלשאלת הטריוויה הזאת אין תשובה.
        </p>
        <Link
          to="/"
          className="btn-pop mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-2.5 font-semibold shadow-lg"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-pop max-w-md text-center p-10">
        <h1 className="text-xl font-display font-semibold">משהו השתבש</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          נסו שוב או חזרו לדף הבית.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-pop rounded-full bg-primary text-primary-foreground px-5 py-2 font-semibold"
          >
            נסו שוב
          </button>
          <a href="/" className="btn-pop rounded-full border border-input bg-card px-5 py-2 font-semibold">
            לדף הבית
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "טריוויה פופ — קרבות טריוויה מרובי משתתפים" },
      { name: "description", content: "שחקו טריוויה לבד או אתגרו חברים בחדרים בזמן אמת. מהיר, צבעוני ובחינם." },
      { name: "author", content: "Trivia Pop" },
      { property: "og:title", content: "טריוויה פופ — קרבות טריוויה מרובי משתתפים" },
      { property: "og:description", content: "שחקו טריוויה לבד או אתגרו חברים בחדרים בזמן אמת." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Rubik:wght@400;500;600;700;800&family=Heebo:wght@400;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

export const Route = createFileRoute("/_authenticated/play/join")({
  component: JoinRoom,
});

function JoinRoom() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean.length !== 6) return toast.error("Room code should be 6 letters");
    setBusy(true);
    try {
      const { data: room, error } = await supabase.from("game_rooms").select("id, status").eq("code", clean).maybeSingle();
      if (error) throw error;
      if (!room) return toast.error("Room not found");
      if (room.status === "finished") return toast.error("This game is over");
      navigate({ to: "/room/$code", params: { code: clean } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to join");
    } finally { setBusy(false); }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="card-pop p-8 animate-pop-in">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-success to-lime text-white shadow-lg">
          <LogIn className="size-6" />
        </div>
        <h1 className="font-display text-3xl font-bold mt-4">Join a room</h1>
        <p className="text-muted-foreground mt-1">Enter the 6-letter code from your host.</p>
        <form onSubmit={join} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="code">Room code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6}
              placeholder="ABC123"
              className="rounded-full h-14 mt-1 text-center font-display text-3xl tracking-[0.4em] uppercase" />
          </div>
          <Button type="submit" disabled={busy}
            className="btn-pop w-full rounded-full h-12 bg-primary text-primary-foreground font-bold text-base">
            {busy ? <Loader2 className="animate-spin size-5" /> : "Join room"}
          </Button>
        </form>
      </div>
    </main>
  );
}

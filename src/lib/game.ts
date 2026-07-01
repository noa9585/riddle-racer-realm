export const BASE_POINTS = 10;
export const SPEED_BONUS_MAX = 5;

/**
 * Score calculation shared between client and server:
 * - Correct answer: 10 points
 * - Speed bonus: up to +5 based on how fast (relative to timeLimit)
 * - Bonus question: doubled
 */
export function calculateScore(opts: {
  isCorrect: boolean;
  responseMs: number;
  timeLimitSec: number;
  isBonus?: boolean;
}) {
  if (!opts.isCorrect) return 0;
  const timeLimitMs = opts.timeLimitSec * 1000;
  const remaining = Math.max(0, timeLimitMs - opts.responseMs);
  const speedBonus = Math.round((remaining / timeLimitMs) * SPEED_BONUS_MAX);
  const total = BASE_POINTS + speedBonus;
  return opts.isBonus ? total * 2 : total;
}

export function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

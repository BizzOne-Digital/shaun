import { schedule, dayOrder, genericBlock } from "@/data/schedule";
import { getShow } from "@/data/shows";
import type { DayKey, ScheduleBlock } from "@/types";

const PH_OFFSET_MINUTES = 8 * 60; // Asia/Manila is UTC+8, no DST

/** Current date/time components in Philippine Time. */
export function getPhilippineNow(): { day: DayKey; minutes: number; label: string } {
  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  let phMinutes = utcMinutes + PH_OFFSET_MINUTES;
  let dayIndex = (now.getUTCDay() + 6) % 7; // 0 = Monday
  if (phMinutes >= 1440) {
    phMinutes -= 1440;
    dayIndex = (dayIndex + 1) % 7;
  }
  const day = dayOrder[dayIndex];
  const h = Math.floor(phMinutes / 60);
  const m = phMinutes % 60;
  const label = `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  return { day, minutes: phMinutes, label };
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** "14:00" → "2:00 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const hour = h === 24 ? 0 : h;
  const suffix = hour < 12 ? "AM" : "PM";
  const display = ((hour + 11) % 12) + 1;
  return `${display}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Convert a Philippine-Time "HH:MM" to the visitor's local time label. */
export function phToLocal(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const utcMinutes = ((h === 24 ? 0 : h) * 60 + m - PH_OFFSET_MINUTES + 1440) % 1440;
  const local = new Date();
  local.setUTCHours(Math.floor(utcMinutes / 60), utcMinutes % 60, 0, 0);
  return local.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export interface ResolvedBlock extends ScheduleBlock {
  name: string;
  genre: string;
  tagline: string;
  slugExists: boolean;
  image?: string;
  art: { from: string; to: string; accent: string; word: string; sub?: string };
}

export function resolveBlock(block: ScheduleBlock): ResolvedBlock {
  const show = getShow(block.showSlug);
  if (show) {
    return {
      ...block,
      name: show.name,
      genre: show.genre,
      tagline: show.tagline,
      slugExists: true,
      image: show.image,
      art: show.art,
    };
  }
  return {
    ...block,
    name: genericBlock.name,
    genre: genericBlock.genre,
    tagline: genericBlock.tagline,
    slugExists: false,
    art: genericBlock.art,
  };
}

export function getDaySchedule(day: DayKey): ResolvedBlock[] {
  return schedule[day].map(resolveBlock);
}

export interface LiveState {
  day: DayKey;
  nowLabel: string;
  current: ResolvedBlock | null;
  next: ResolvedBlock | null;
  minutesToNext: number | null;
}

/** Which show is live right now (Philippine Time) and what's next. */
export function getLiveState(): LiveState {
  const { day, minutes, label } = getPhilippineNow();
  const blocks = getDaySchedule(day);
  let current: ResolvedBlock | null = null;
  let next: ResolvedBlock | null = null;

  for (const b of blocks) {
    if (minutes >= toMinutes(b.start) && minutes < toMinutes(b.end)) current = b;
    else if (toMinutes(b.start) > minutes && !next) next = b;
  }

  if (!next) {
    const nextDay = dayOrder[(dayOrder.indexOf(day) + 1) % 7];
    next = getDaySchedule(nextDay)[0] ?? null;
  }

  let minutesToNext: number | null = null;
  if (next) {
    const startMin = toMinutes(next.start);
    minutesToNext = startMin > minutes ? startMin - minutes : 1440 - minutes + startMin;
  }

  return { day, nowLabel: label, current, next, minutesToNext };
}

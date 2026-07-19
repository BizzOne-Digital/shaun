import type { DayKey, ScheduleBlock, WeekSchedule } from "@/types";

/**
 * MONSTEROUS RADIO — WEEKLY SCHEDULE (Philippine Time, 24h format)
 *
 * ✅ CONFIRMED against the client's official schedule spreadsheet
 *    (received July 2026):
 *    · Mon–Thu & Sat: The Daily Dose runs 6:00 AM – 2:00 PM
 *    · Fri & Sun:     The Daily Dose runs 6:00 AM – 9:00 AM
 *    · Friday:        Golds (70s & 80s) 9:00 AM – 9:00 PM
 *    · Sunday:        Sunday Reggae Sunsplash 9:00 AM – 4:00 PM,
 *                     then Low Down 4:00 PM – 6:00 PM
 *    · Saturday:      The Weekend Blow Out 9:00 PM – 12:00 AM,
 *                     continuing Sunday 12:00 AM – 3:00 AM
 *    · Christian Contemporary nightly 9:00 PM – 12:00 AM (except Saturday)
 *
 * Edit this file only — pages read the schedule from here.
 */

const monThu: ScheduleBlock[] = [
  { start: "00:00", end: "03:00", showSlug: "low-down" },
  { start: "03:00", end: "06:00", showSlug: "lite-heart" },
  { start: "06:00", end: "14:00", showSlug: "the-daily-dose" },
  { start: "14:00", end: "18:00", showSlug: "low-down" },
  { start: "18:00", end: "21:00", showSlug: "rock-this-time" },
  { start: "21:00", end: "24:00", showSlug: "christian-contemporary" },
];

export const schedule: WeekSchedule = {
  monday: monThu,
  tuesday: monThu,
  wednesday: monThu,
  thursday: monThu,
  friday: [
    { start: "00:00", end: "03:00", showSlug: "low-down" },
    { start: "03:00", end: "06:00", showSlug: "lite-heart" },
    { start: "06:00", end: "09:00", showSlug: "the-daily-dose" },
    { start: "09:00", end: "21:00", showSlug: "golds" },
    { start: "21:00", end: "24:00", showSlug: "christian-contemporary" },
  ],
  saturday: [
    { start: "00:00", end: "03:00", showSlug: "low-down" },
    { start: "03:00", end: "06:00", showSlug: "lite-heart" },
    { start: "06:00", end: "14:00", showSlug: "the-daily-dose" },
    { start: "14:00", end: "18:00", showSlug: "low-down" },
    { start: "18:00", end: "21:00", showSlug: "rock-this-time" },
    { start: "21:00", end: "24:00", showSlug: "the-weekend-blow-out" },
  ],
  sunday: [
    {
      start: "00:00",
      end: "03:00",
      showSlug: "the-weekend-blow-out",
      note: "Saturday Night House Party continuation",
    },
    { start: "03:00", end: "06:00", showSlug: "lite-heart" },
    { start: "06:00", end: "09:00", showSlug: "the-daily-dose" },
    { start: "09:00", end: "16:00", showSlug: "sunday-reggae-sunsplash" },
    { start: "16:00", end: "18:00", showSlug: "low-down" },
    { start: "18:00", end: "21:00", showSlug: "rock-this-time" },
    { start: "21:00", end: "24:00", showSlug: "christian-contemporary" },
  ],
};

/** Generic fallback block used when a slot has no dedicated show entry. */
export const genericBlock = {
  slug: "monster-hits",
  name: "Monster Hits",
  genre: "All Hits",
  tagline: "Regular Monsterous Radio programming.",
  art: { from: "#53107a", to: "#050407", accent: "#b6e51d", word: "MONSTER", sub: "HITS" },
};

export const dayOrder: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const dayLabels: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

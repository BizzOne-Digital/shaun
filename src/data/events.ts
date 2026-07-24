import type { RadioEvent } from "@/types";

/**
 * MONSTEROUS RADIO — CONCERTS & EVENTS
 * Upcoming concerts, live performances, and station events.
 * Each entry becomes /events/[slug] automatically.
 */

export const eventCategories = [
  "All",
  "Concerts",
  "Festivals",
  "Station Events",
  "Community",
] as const;

export const events: RadioEvent[] = [
  // Sample placeholder events — replace with real events
  {
    slug: "summer-music-festival-2026",
    title: "Summer Music Festival 2026",
    date: "2026-08-15T18:00:00+08:00",
    endDate: "2026-08-17T23:00:00+08:00",
    venue: "SM Mall of Asia Concert Grounds",
    location: "Pasay City, Philippines",
    description:
      "Join us for three days of non-stop music featuring local and international artists across multiple genres. Monsterous Radio is proud to be the official media partner for this year's Summer Music Festival.",
    ticketUrl: "https://www.smtickets.com/events/summer-music-festival",
    isDemo: true,
  },
  {
    slug: "monsterous-live-launch-party",
    title: "Monsterous Radio Live Launch Party",
    date: "2026-09-01T20:00:00+08:00",
    venue: "The Palace Pool Club",
    location: "Bonifacio Global City, Philippines",
    description:
      "Celebrate the launch of Monsterous Radio's new platform with an exclusive night of music, giveaways, and live DJ sets. Meet your favorite DJs and enjoy special performances throughout the night.",
    isDemo: true,
  },
  {
    slug: "reggae-night-at-the-beach",
    title: "Reggae Night at the Beach",
    date: "2026-09-20T17:00:00+08:00",
    venue: "White Beach",
    location: "Boracay, Philippines",
    description:
      "A special edition of Sunday Reggae Sunsplash brought to you live from Boracay. Join us for sunset vibes, live reggae performances, and island beats by the shore.",
    isDemo: true,
  },
];

/**
 * Get a single event by slug.
 */
export function getEvent(slug: string): RadioEvent | undefined {
  return events.find((e) => e.slug === slug);
}

/**
 * Get upcoming events (not past their end date or main date).
 */
export function getUpcomingEvents(): RadioEvent[] {
  const now = new Date();
  return events.filter((e) => {
    const eventDate = new Date(e.endDate || e.date);
    return eventDate >= now;
  });
}

/**
 * Get past events.
 */
export function getPastEvents(): RadioEvent[] {
  const now = new Date();
  return events.filter((e) => {
    const eventDate = new Date(e.endDate || e.date);
    return eventDate < now;
  });
}

/**
 * Get related events (same venue or close date — simple heuristic).
 */
export function getRelatedEvents(slug: string, limit = 3): RadioEvent[] {
  const current = getEvent(slug);
  if (!current) return [];

  return events
    .filter((e) => e.slug !== slug)
    .slice(0, limit);
}

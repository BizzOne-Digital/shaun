export interface Show {
  slug: string;
  name: string;
  shortName?: string;
  genre: string;
  genres: string[];
  tagline: string;
  description: string;
  scheduleSummary: string;
  /** Optional artwork path in /public/shows — CSS placeholder used when absent */
  image?: string;
  /** Accent colors used by the typographic CSS artwork */
  art: {
    from: string;
    to: string;
    accent: string;
    /** Big word rendered on the generated cover */
    word: string;
    sub?: string;
  };
  host?: string;
  sponsor?: AdCampaign | null;
}

export interface ScheduleBlock {
  start: string; // "HH:MM" 24h Philippine Time
  end: string;
  showSlug: string;
  /** Marks blocks awaiting final client confirmation */
  needsConfirmation?: boolean;
  note?: string;
}

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WeekSchedule = Record<DayKey, ScheduleBlock[]>;

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO
  excerpt: string;
  readingTime: string;
  image?: string;
  art: { from: string; to: string; word: string };
  body: string[];
}

export interface RadioEvent {
  slug: string;
  title: string;
  date: string; // ISO
  endDate?: string;
  venue: string;
  location: string;
  description: string;
  image?: string;
  ticketUrl?: string;
  isDemo?: boolean;
}

export interface AdCampaign {
  image?: string;
  alt: string;
  url?: string;
  sponsorName: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export type AdPlacement =
  | "top-banner"
  | "sidebar"
  | "player"
  | "footer"
  | "show-page";

export interface AdFormat {
  id: string;
  name: string;
  description: string;
  details: string[];
  price?: string;
}

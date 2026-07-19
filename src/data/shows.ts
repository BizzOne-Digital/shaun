import type { Show } from "@/types";

/**
 * MONSTEROUS RADIO — SHOW CATALOG
 * Edit this file to add / change shows. Artwork goes in /public/shows.
 * When `image` is missing the site renders a premium typographic
 * cover generated from the `art` colors — no stock photos are used.
 */
export const shows: Show[] = [
  {
    slug: "the-daily-dose",
    name: "The Daily Dose",
    genre: "Top 40",
    genres: ["Pop", "Top 40", "R&B"],
    tagline: "Monster hits from the 90s to today.",
    description:
      "The flagship daytime program of Monsterous Radio. The Daily Dose delivers a nonstop mix of monster hits and contemporary favorites spanning the 90s through today — the perfect soundtrack for mornings, commutes and workdays across the Philippines and North America.",
    scheduleSummary: "Mon–Thu & Sat 6:00 AM – 2:00 PM · Fri & Sun 6:00 AM – 9:00 AM",
    image: "/shows/the-daily-dose.png",
    art: { from: "#f5e642", to: "#8a1fb8", accent: "#b6e51d", word: "THE DAILY", sub: "DOSE" },
  },
  {
    slug: "lite-heart",
    name: "Lite Heart",
    genre: "Love Songs",
    genres: ["Lite Rock", "Ballads", "Love Songs"],
    tagline: "Love songs and ballads for the quiet hours.",
    description:
      "Lite Heart fills the early hours with timeless love songs and heartfelt ballads. Soft, warm and effortlessly romantic, it is the gentlest corner of the Monsterous Radio schedule.",
    scheduleSummary: "Daily 3:00 AM – 6:00 AM",
    image: "/shows/lite-heart.png",
    art: { from: "#ed37bd", to: "#21072d", accent: "#f8f6fb", word: "LITE", sub: "HEART" },
  },
  {
    slug: "low-down",
    name: "Low Down",
    genre: "Easy Rock",
    genres: ["Easy Rock", "Chill", "Relaxing Favorites"],
    tagline: "Easy rock and relaxing favorites.",
    description:
      "Low Down keeps things smooth with easy rock and relaxing favorites. Whether it is late night or a mellow afternoon, Low Down is the wind-down soundtrack of Monsterous Radio.",
    scheduleSummary: "Mon–Sat 12:00 AM – 3:00 AM · Mon–Thu & Sat 2:00 PM – 6:00 PM · Sun 4:00 PM – 6:00 PM",
    art: { from: "#2d1b4e", to: "#050407", accent: "#a82de0", word: "LOW", sub: "DOWN" },
  },
  {
    slug: "rock-this-time",
    name: "Rock This Time",
    genre: "Rock",
    genres: ["Classic Rock", "Rock", "Alternative"],
    tagline: "Classic rock, rock and alternative — turned up.",
    description:
      "Rock This Time is where the amps stay warm. From classic rock anthems to modern alternative, this nightly block powers your evenings with riffs, energy and attitude.",
    scheduleSummary: "Every night except Friday · 6:00 PM – 9:00 PM",
    image: "/shows/rock-this-time.png",
    art: { from: "#111111", to: "#3d0a52", accent: "#f8f6fb", word: "ROCK", sub: "THIS TIME" },
  },
  {
    slug: "golds",
    name: "Golds",
    genre: "70s & 80s",
    genres: ["70s", "80s", "Classic Hits"],
    tagline: "Solid gold — music from the 70s and 80s.",
    description:
      "Every Friday, Golds takes over with twelve straight hours of certified classics from the 70s and 80s. Disco, new wave, soft rock and golden-era pop — all killer, no filler.",
    scheduleSummary: "Friday 9:00 AM – 9:00 PM",
    art: { from: "#f3c744", to: "#7a4a03", accent: "#050407", word: "GOLDS", sub: "70s & 80s" },
  },
  {
    slug: "sunday-reggae-sunsplash",
    name: "Sunday Reggae Sunsplash",
    shortName: "Sunday Reggae",
    genre: "Reggae",
    genres: ["Reggae", "Island", "Tropical", "Ska"],
    tagline: "Reggae, island, tropical and ska — every Sunday.",
    description:
      "Sunday Reggae Sunsplash turns every Sunday into an island escape. Seven hours of reggae, tropical vibes, ska and sunshine rhythms to keep your weekend irie.",
    scheduleSummary: "Sunday 9:00 AM – 4:00 PM",
    image: "/shows/sunday-reggae.png",
    art: { from: "#1b8a3a", to: "#0a3d14", accent: "#f5e642", word: "SUNDAY", sub: "REGGAE" },
  },
  {
    slug: "the-weekend-blow-out",
    name: "The Weekend Blow Out",
    genre: "House",
    genres: ["House", "Dance", "Party Mixes"],
    tagline: "The Saturday night house party.",
    description:
      "When Saturday night hits, The Weekend Blow Out takes the controls. House, dance and party mixes carry the energy from Saturday night deep into Sunday morning.",
    scheduleSummary: "Saturday 9:00 PM – Sunday 3:00 AM (Saturday Night House Party)",
    art: { from: "#a82de0", to: "#12041a", accent: "#b6e51d", word: "WEEKEND", sub: "BLOW OUT" },
  },
  {
    slug: "christian-contemporary",
    name: "Christian Contemporary",
    genre: "Christian",
    genres: ["Christian Contemporary", "Worship"],
    tagline: "Contemporary Christian music to end the day.",
    description:
      "Christian Contemporary closes out most evenings with uplifting contemporary Christian music — a peaceful, inspiring way to end the day, every day except Saturday.",
    scheduleSummary: "Every night except Saturday · 9:00 PM – 12:00 AM",
    art: { from: "#f8f6fb", to: "#6f1599", accent: "#050407", word: "CHRISTIAN", sub: "CONTEMPORARY" },
  },
];

export const getShow = (slug: string): Show | undefined =>
  shows.find((s) => s.slug === slug);

export const getRelatedShows = (slug: string, count = 3): Show[] =>
  shows.filter((s) => s.slug !== slug).slice(0, count);

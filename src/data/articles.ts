import type { Article } from "@/types";

/**
 * MONSTEROUS RADIO — NEWS & FEATURES
 * Local editorial data. Articles from the old website can be migrated
 * here later — each entry becomes /news/[slug] automatically.
 * All entries below are clearly station-related editorial samples,
 * not fabricated industry claims.
 */
export const articleCategories = [
  "All",
  "Station News",
  "Music",
  "Shows",
  "Advertising",
] as const;

export const articles: Article[] = [
  {
    slug: "welcome-to-the-new-monsterous-radio",
    title: "Welcome to the New Monsterous Radio Website",
    category: "Station News",
    date: "2026-07-10",
    excerpt:
      "A faster, bolder home for your favorite monster hits — with a persistent live player, a full weekly schedule and easier ways for brands to partner with the station.",
    readingTime: "3 min read",
    image: "/news/new-website.png",
    art: { from: "#6f1599", to: "#0d0911", word: "NEW ERA" },
    body: [
      "Monsterous Radio has a brand-new home on the web. The redesigned site puts the music first: a persistent live player follows you across every page, so exploring the schedule, reading features or browsing shows never interrupts your listening.",
      "The full weekly schedule is now easier to explore than ever, with day-by-day views, live-now indicators and Philippine Time alongside your local time. Every show has its own page with artwork, air times and genre details.",
      "For brands and businesses, a dedicated Advertise section explains sponsorships, in-stream audio campaigns and website placements — with a simple inquiry form that goes straight to the station team.",
      "This is only the beginning. News, features and event coverage will continue to grow right here. Thanks for listening — and welcome to the new Monsterous Radio.",
    ],
  },
  {
    slug: "inside-the-weekly-schedule",
    title: "Inside the Monsterous Radio Weekly Schedule",
    category: "Shows",
    date: "2026-07-08",
    excerpt:
      "From Lite Heart's late-night ballads to the Weekend Blow Out house party, here is how a full week sounds on Monsterous Radio.",
    readingTime: "4 min read",
    image: "/news/weekly-schedule.png",
    art: { from: "#a82de0", to: "#12041a", word: "ON AIR" },
    body: [
      "A week on Monsterous Radio is designed to match your day. Early mornings belong to Lite Heart, three hours of love songs and ballads for the quiet hours before sunrise.",
      "From 6 AM, The Daily Dose takes over with monster hits from the 90s to today — the station's flagship daytime program. Afternoons wind down with Low Down's easy rock and relaxing favorites before Rock This Time turns the amps up each evening.",
      "Fridays are special: Golds delivers twelve straight hours of 70s and 80s classics. Saturdays end with The Weekend Blow Out, a house party that runs deep into Sunday morning, and Sundays belong to the Sunday Reggae Sunsplash.",
      "Most evenings close with Christian Contemporary, an uplifting way to end the day. Check the full schedule page for every time slot in Philippine Time and your local time.",
    ],
  },
  {
    slug: "why-genre-radio-still-matters",
    title: "Why Multi-Genre Radio Still Matters in the Streaming Era",
    category: "Music",
    date: "2026-07-05",
    excerpt:
      "Algorithms guess. Radio curates. A look at why a station that plays Pop, Reggae, OPM, K-Pop and Rock in a single day still feels irreplaceable.",
    readingTime: "5 min read",
    image: "/news/multi-genre-radio.png",
    art: { from: "#b6e51d", to: "#1a2604", word: "RADIO" },
    body: [
      "Streaming playlists are built by algorithms that learn what you already like. Radio does something different: it surprises you. On a multi-genre station, a reggae afternoon can follow a morning of contemporary hits, and a classic rock evening can lead into worship music at night.",
      "That variety is Monsterous Radio's entire identity. The schedule combines a mainstream hit format with themed specialty shows, letting listeners drift between moods and eras without touching a skip button.",
      "It also matters for artists and communities. OPM, K-Pop, Christian Contemporary and reggae each get dedicated space rather than being buried in an algorithmic feed.",
      "Radio is shared, live and human. That is why it still matters — and why we keep the stream running 24/7.",
    ],
  },
  {
    slug: "partner-with-monsterous-radio",
    title: "How Brands Can Partner With Monsterous Radio",
    category: "Advertising",
    date: "2026-07-01",
    excerpt:
      "Show sponsorships, in-stream audio spots and website placements — a quick guide to putting your brand in the mix.",
    readingTime: "3 min read",
    art: { from: "#ed37bd", to: "#2d0a24", word: "PARTNER" },
    body: [
      "Monsterous Radio reaches a diverse 20–50 audience across the Philippines and North America, around the clock. For brands, that means flexible ways to be heard and seen.",
      "In-stream audio spots run from 15 to 60 seconds inside approved programming windows. Show sponsorships attach your brand to a specific program — with 'Presented by' visibility on the show's page and campaign mentions.",
      "Website placements include the premium top banner, player-adjacent positions, sidebar placements and footer banners, all linking directly to your campaign.",
      "Ready to start? Visit the Advertise page and request the media kit — the team will respond with current rates and custom campaign options.",
    ],
  },
];

export const getArticle = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);

export const getRelatedArticles = (slug: string, count = 3): Article[] =>
  articles.filter((a) => a.slug !== slug).slice(0, count);

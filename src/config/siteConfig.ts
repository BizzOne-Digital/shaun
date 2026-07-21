/**
 * ─────────────────────────────────────────────────────────────────
 *  MONSTEROUS RADIO — CENTRAL SITE CONFIGURATION
 *  Every piece of contact / stream / business information lives
 *  here so it can be changed without touching any component.
 * ─────────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  name: "Monsterous Radio",
  legalName: "Monsterous Radio",
  tagline: "Playin' Your Favorite Monster Hits!",
  heroHeadline: "Playing Your Favorite Monster Hits 24/7",
  description:
    "Monsterous Radio is an international 24/7 online radio station delivering Pop, Rock, OPM, K-Pop, Reggae, Christian Contemporary and more to listeners across the Philippines and North America.",
  url: "https://monsterousradio.com",

  // ── Contact (client-approved temporary details) ────────────────
  // NOTE: info@monsterousradio.com must NOT be used yet — the client
  // currently has no access to that mailbox.
  contact: {
    phone: "(778) 239-8220",
    phoneHref: "tel:+17782398220",
    email: "sbyoung2000@gmail.com",
    emailAlt: "info@theoceanradio.com",
    hoursLabel: "24/7 Online Station",
    locationLabel: "Serving the Philippines and North America",
  },

  social: {
    facebook: "https://www.facebook.com/monsterousradio/",
    website: "https://monsterousradio.com/",
  },

  regions: ["Philippines", "North America"],
  audienceAge: "20–50",
  timezoneLabel: "Philippine Time (GMT+8)",
  timezone: "Asia/Manila",

  // ── Streaming ──────────────────────────────────────────────────
  // Provide the direct stream URL via .env.local:
  //   NEXT_PUBLIC_RADIO_STREAM_URL=https://.../stream.mp3
  //   NEXT_PUBLIC_RADIO_METADATA_URL=https://.../status-json.xsl
  //   NEXT_PUBLIC_LEGACY_PLAYER_URL=https://.../legacy-embed
  stream: {
    streamUrl: process.env.NEXT_PUBLIC_RADIO_STREAM_URL || "",
    metadataUrl: process.env.NEXT_PUBLIC_RADIO_METADATA_URL || "",
    // Spacial SAM Cloud player iframe (from live monsterousradio.com)
    legacyEmbedUrl:
      process.env.NEXT_PUBLIC_LEGACY_PLAYER_URL ||
      "https://samcloudmedia.spacial.com/webwidgets/player/v4/300x160.html?sid=119993&rid=246832&startstation=false&theme=light&showBuyButton=never&token=7c6731c912458b9e4c1fb7935f5efa65468d7ba6",
  },

  // ── Spacial / SAM Broadcaster Cloud widgets ────────────────────
  // Playlist + (future) player/chat embeds from the station dashboard.
  spacial: {
    // Proxied via next.config rewrite → same-origin module loads for playlist/chat.
    scriptUrl: "/spacial-widgets/sam-widgets.esm.js",
    stationId: "119993",
    token: "7c6731c912458b9e4c1fb7935f5efa65468d7ba6",
    playlistId: "7b9cb77a-4311-4ffc-a0ea-abc0001e2c55",
    playlistName: "Absolute Love Songs",
    // Brand-aligned widget theme (purple / lime instead of default grey)
    theme: {
      backgroundTop: "#150920",
      backgroundBottom: "#0d0911",
      widgetBorder: "#53107a",
      dividers: "#2a1538",
      buttons: "#b6e51d",
      text: "#f8f6fb",
    },
  },

  // ── Advertising ────────────────────────────────────────────────
  // Old rate cards conflict — keep prices hidden until the client
  // approves ONE current rate card. Flip to `true` to load rates
  // from src/data/advertising.ts.
  showAdvertisingPrices: false,

  // ── Media kit ──────────────────────────────────────────────────
  // Place the approved PDF at public/documents/… and it will be
  // downloadable automatically. Set `mediaKitAvailable` to true
  // once the file has been uploaded.
  mediaKitUrl: "/documents/monsterous-radio-media-kit.pdf",
  mediaKitAvailable: false,

  // ── Advertising slots (toggle per placement) ───────────────────
  adSlots: {
    topBanner: { enabled: true, showPlaceholder: false },
    sidebar: { enabled: true, showPlaceholder: true },
    player: { enabled: false, showPlaceholder: false },
    footer: { enabled: true, showPlaceholder: true },
  },

  genres: [
    "Pop",
    "Rock",
    "Alternative",
    "Reggae",
    "R&B",
    "Hip-Hop",
    "OPM",
    "K-Pop",
    "Christian Contemporary",
    "House",
    "Jazz",
    "Lite Rock",
  ],

  stats: [
    { value: "24/7", label: "Nonstop Streaming", numeric: null },
    { value: "15+", label: "Specialty Shows", numeric: 15, suffix: "+" },
    { value: "12+", label: "Music Genres", numeric: 12, suffix: "+" },
    { value: "2", label: "Continents Served", numeric: 2, suffix: "" },
    { value: "20–50", label: "Audience Age Range", numeric: null },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

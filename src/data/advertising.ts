import type { AdFormat } from "@/types";

/**
 * MONSTEROUS RADIO — ADVERTISING PRODUCTS
 *
 * ⚠ PRICING: The legacy documents contain CONFLICTING rate cards, so
 * prices are intentionally OMITTED. When the client approves a single
 * current rate card, add a `price` field to each format below and set
 * `showAdvertisingPrices: true` in src/config/siteConfig.ts.
 */

export const audioSpots: AdFormat[] = [
  {
    id: "audio-15",
    name: "15-Second Audio Spot",
    description: "A quick, punchy in-stream message played during approved programming windows.",
    details: ["In-stream rotation", "Professional insertion", "Ideal for reminders & promos"],
  },
  {
    id: "audio-30",
    name: "30-Second Audio Spot",
    description: "The industry-standard spot length — enough room for a full brand story.",
    details: ["In-stream rotation", "Best value-to-impact ratio", "Most popular format"],
  },
  {
    id: "audio-45",
    name: "45-Second Audio Spot",
    description: "Extended messaging for campaigns that need detail and personality.",
    details: ["In-stream rotation", "Extended storytelling", "Great for launches"],
  },
  {
    id: "audio-60",
    name: "60-Second Audio Spot",
    description: "A full minute of airtime for immersive, narrative-driven brand messages.",
    details: ["In-stream rotation", "Maximum airtime", "Narrative campaigns"],
  },
];

export const websitePlacements: AdFormat[] = [
  {
    id: "top-banner",
    name: "Premium Top Banner",
    description: "The most visible placement on the site — 970×90 above the navigation on high-traffic pages.",
    details: ["970×90 desktop / responsive mobile", "Site-wide or per-page", "Direct campaign link"],
  },
  {
    id: "player-ad",
    name: "Radio-Player Placement",
    description: "Your brand beside the live player — seen every time a listener tunes in.",
    details: ["Adjacent to live controls", "Persistent visibility", "High engagement zone"],
  },
  {
    id: "sidebar-ad",
    name: "Sidebar Button Advertisement",
    description: "A compact, always-visible placement alongside editorial and schedule content.",
    details: ["300×250 responsive", "Contextual positioning", "Rotation available"],
  },
  {
    id: "vertical-banner",
    name: "Vertical Banner",
    description: "A tall-format placement for maximum on-scroll visibility.",
    details: ["160×600 / 300×600", "Strong scroll presence", "Campaign-ready"],
  },
  {
    id: "footer-ad",
    name: "Footer Advertisement",
    description: "Site-wide 970×90 placement at the end of every page journey.",
    details: ["970×90 desktop / responsive mobile", "Every page", "Cost-effective reach"],
  },
];

export const sponsorships: AdFormat[] = [
  {
    id: "show-sponsorship",
    name: "Show Sponsorship",
    description: "Own a program your audience already loves — 'Presented by' branding across the show's presence.",
    details: [
      "Sponsor-selected show",
      "Brand placement on show pages",
      "Campaign mentions",
      "Associated update placements",
    ],
  },
];

export const bundles: AdFormat[] = [
  {
    id: "bundle-custom",
    name: "Bundled Campaigns",
    description: "Combine audio spots, show sponsorship and website exposure into one coordinated campaign.",
    details: [
      "Audio + website exposure",
      "Custom campaign packages",
      "Monthly and quarterly options",
    ],
  },
];

export const whyAdvertise = [
  {
    title: "Niche Targeting",
    text: "Align your product with the exact show, genre or daypart that matches your customers.",
  },
  {
    title: "Multi-Genre Audience",
    text: "From Pop and OPM to Reggae, Rock and K-Pop — reach clearly defined music communities.",
  },
  {
    title: "24/7 Station Exposure",
    text: "The stream never stops. Your campaign can live across every hour of the day.",
  },
  {
    title: "Cross-Platform Visibility",
    text: "Combine in-stream audio with website placements for audio and visual impact.",
  },
  {
    title: "Show-Specific Sponsorship",
    text: "Attach your brand to a specific program with 'Presented by' visibility.",
  },
  {
    title: "Mobile & Desktop Reach",
    text: "Listeners tune in from phones, desktops and smart devices in two continents.",
  },
];

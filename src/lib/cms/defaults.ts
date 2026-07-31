import { siteConfig } from "@/config/siteConfig";

export type CmsSection = {
  _id?: string;
  key: string;
  label: string;
  enabled: boolean;
  headline: string;
  subheadline: string;
  body: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  extra?: Record<string, unknown>;
};

export type CmsPage = {
  slug: string;
  title: string;
  path: string;
  seoDescription: string;
  sections: CmsSection[];
};

function section(
  key: string,
  label: string,
  data: Partial<CmsSection> = {},
): CmsSection {
  return {
    key,
    label,
    enabled: true,
    headline: "",
    subheadline: "",
    body: "",
    image: "",
    imageAlt: "",
    ctaLabel: "",
    ctaHref: "",
    extra: {},
    ...data,
  };
}

/** Default editable pages + sections matching the live site structure. */
export function defaultPages(): CmsPage[] {
  return [
    {
      slug: "home",
      title: "Home",
      path: "/",
      seoDescription: siteConfig.description,
      sections: [
        section("hero", "Hero", {
          headline: siteConfig.heroHeadline,
          subheadline: siteConfig.tagline,
          image: "/studio/hero-mic.png",
          imageAlt: "Studio microphone",
          ctaLabel: "Listen Live",
          ctaHref: "/listen",
        }),
        section("live-now", "Live Now", {
          headline: "Live Now",
          body: "Current show and on-air status block.",
        }),
        section("featured-grid", "Featured Shows & News", {
          headline: "On Air & In Focus",
          body: "Featured shows and latest news grid.",
        }),
        section("today-schedule", "Today's Schedule", {
          headline: "Today on Monsterous Radio",
        }),
        section("genres", "Genre Universe", {
          headline: "Genre Universe",
          body: "Explore the music genres we play.",
        }),
        section("listen-promo", "Listen Promo", {
          headline: "The Monster Never Sleeps",
          subheadline: siteConfig.tagline,
          body: "We're On Air 24/7",
          ctaLabel: "Start Listening",
          ctaHref: "/listen",
        }),
        section("advertise-cta", "Advertiser CTA", {
          headline: "Put Your Brand On Air",
          body: "Reach listeners across the Philippines and North America.",
          image: "/studio/hero-mic.png",
          ctaLabel: "Advertise With Us",
          ctaHref: "/advertise",
        }),
      ],
    },
    {
      slug: "listen",
      title: "Listen Live",
      path: "/listen",
      seoDescription: "Listen live to Monsterous Radio — player, chat and schedule.",
      sections: [
        section("hero", "Page Intro", {
          headline: "Listen Live",
          body: "Tune in to Monsterous Radio anytime — 24/7 monster hits.",
        }),
        section("player", "Live Player", {
          headline: "Live Player",
          body: "Spacial SAM Cloud live player embed.",
        }),
        section("chat", "DJ Chat", {
          headline: "Chat with the DJ",
          body: "Send a message while you listen live.",
        }),
      ],
    },
    {
      slug: "shows",
      title: "Shows & Schedule",
      path: "/shows",
      seoDescription: "Monsterous Radio shows and weekly schedule.",
      sections: [
        section("hero", "Hero", {
          headline: "Shows & Schedule",
          body: "Every specialty show and the full weekly grid.",
          image: "/studio/shows-hero.png",
        }),
        section("grid", "Shows Grid", {
          headline: "Our Shows",
        }),
        section("schedule", "Weekly Schedule", {
          headline: "Weekly Schedule",
        }),
      ],
    },
    {
      slug: "news",
      title: "News",
      path: "/news",
      seoDescription: "Station news and features from Monsterous Radio.",
      sections: [
        section("hero", "Hero", {
          headline: "News & Features",
          body: "Updates from the station.",
          image: "/studio/news-hero.png",
        }),
      ],
    },
    {
      slug: "about",
      title: "About",
      path: "/about",
      seoDescription: "About Monsterous Radio.",
      sections: [
        section("hero", "Hero", {
          headline: "About Monsterous Radio",
          body: "An international 24/7 online station built around variety.",
          image: "/studio/about-hero.png",
        }),
        section("story", "Our Story", {
          headline: "Our Story",
          body: siteConfig.description,
        }),
        section("different", "What Makes Us Different", {
          headline: "What Makes Us Different",
          body: "Diverse music, global community, 24/7 streaming, advertiser friendly.",
        }),
      ],
    },
    {
      slug: "contact",
      title: "Contact",
      path: "/contact",
      seoDescription: "Contact Monsterous Radio.",
      sections: [
        section("hero", "Hero", {
          headline: "Contact",
          body: "Reach the Monsterous Radio team.",
          image: "/studio/contact-hero.png",
        }),
        section("details", "Contact Details", {
          headline: "Get in Touch",
          body: `Email ${siteConfig.contact.email} or call ${siteConfig.contact.phone}.`,
        }),
      ],
    },
    {
      slug: "advertise",
      title: "Advertise",
      path: "/advertise",
      seoDescription: "Advertise on Monsterous Radio.",
      sections: [
        section("hero", "Hero", {
          headline: "Advertise With Us",
          body: "Sponsorships, in-stream audio and website placements.",
        }),
        section("cta", "Bottom CTA", {
          headline: "Ready to put your brand on air?",
          image: "/studio/advertise-cta-bg.png",
          ctaLabel: "Start an Inquiry",
          ctaHref: "/advertise#inquiry",
        }),
      ],
    },
    {
      slug: "media-kit",
      title: "Media Kit",
      path: "/media-kit",
      seoDescription: "Monsterous Radio media kit.",
      sections: [
        section("hero", "Hero", {
          headline: "Media Kit",
          body: "Audience, formats and partnership overview.",
        }),
      ],
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      path: "/privacy",
      seoDescription: "Privacy policy.",
      sections: [
        section("content", "Policy Content", {
          headline: "Privacy Policy",
          body: "Edit privacy policy sections from admin or keep the coded defaults.",
        }),
      ],
    },
    {
      slug: "terms",
      title: "Terms of Use",
      path: "/terms",
      seoDescription: "Terms of use.",
      sections: [
        section("content", "Terms Content", {
          headline: "Terms of Use",
          body: "Edit terms content from admin or keep the coded defaults.",
        }),
      ],
    },
  ];
}

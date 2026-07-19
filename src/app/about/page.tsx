import type { Metadata } from "next";
import Link from "next/link";
import {
  Radio,
  Globe2,
  Music4,
  Megaphone,
  Smartphone,
  Users,
  Clock,
  Mic2,
  Play,
} from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { Waveform } from "@/components/animations/Waveform";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Monsterous Radio — an international 24/7 online station built around variety, serving listeners in the Philippines, North America and beyond.",
  alternates: { canonical: `${siteConfig.url}/about` },
};

/** "What makes us different" columns (reference design). */
const DIFFERENT = [
  {
    icon: Music4,
    title: "Diverse Music & Shows",
    text: "A wide range of genres and niche shows for every music lover.",
  },
  {
    icon: Users,
    title: "Global Community",
    text: "Connecting listeners worldwide through music and social platforms.",
  },
  {
    icon: Globe2,
    title: "24/7 Streaming",
    text: "Non-stop music round the clock from the 60s to today's hits.",
  },
  {
    icon: Megaphone,
    title: "Advertiser Friendly",
    text: "Powerful advertising solutions that put your brand in front of the right audience.",
  },
  {
    icon: Smartphone,
    title: "Multi-Platform Access",
    text: "Listen on any device, anywhere. Website, mobile and social networks.",
  },
];

/**
 * "Our reach" strip — confirmed, client-approved figures only
 * (no invented listener counts per project rules).
 */
const REACH = [
  { icon: Clock, value: "24/7", label: "Non-Stop", sub: "all day, every day" },
  { icon: Mic2, value: "15+", label: "Exclusive Shows", sub: "for every taste" },
  { icon: Music4, value: "Multiple", label: "Music Genres", sub: "from 60s to today" },
  { icon: Globe2, value: "2", label: "Continents Served", sub: "Philippines & North America" },
  { icon: Users, value: "20–50", label: "Audience Age", sub: "music lovers & brands" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — studio + mascot backdrop (place photo at public/studio/about-hero.png) */}
      <PageHero
        kicker="About Monsterous Radio"
        title="About Us"
        image="/studio/about-hero.png"
        imagePosition="object-[65%_center]"
      >
        <div className="mt-4">
          <p className="display text-xl tracking-wide text-lime sm:text-2xl">
            Your Radio. Your Music. Your Community.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Monsterous Radio is an international online radio station bringing you the best mix of
            music, shows and entertainment 24/7.
          </p>
        </div>
      </PageHero>

      {/* Who we are + what makes us different (reference design) */}
      <section
        className="border-b border-line py-16"
        style={{ background: "linear-gradient(180deg, #110618 0%, #0b040f 100%)" }}
        aria-label="Who we are"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8">
          {/* Left — who we are */}
          <Reveal>
            <p className="kicker text-magenta">Who We Are</p>
            <h2 className="display mt-3 text-3xl leading-tight text-white sm:text-4xl">
              Playin&apos; Your Favorite
              <br />
              Monster Hits!
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
              <p>
                Monsterous Radio is YOUR radio — the radio of the future, now playing. Our mission
                is to provide our listeners with a wide variety of music and shows that entertain,
                inform and connect people from around the world.
              </p>
              <p>
                Our station features Lite Rock, Contemporary Hits, Reggae, R&amp;B, Hip-Hop, OPM,
                Indie, Christian Music, Korean Pop and much more.
              </p>
              <p>
                We are available 24/7 anywhere in the world. All you need is an internet connection
                and you are good to go!
              </p>
            </div>
            <Link href="/listen" className="btn btn-outline mt-8">
              <Play className="h-4 w-4" aria-hidden="true" />
              Listen Live Now
            </Link>
          </Reveal>

          {/* Right — what makes us different */}
          <Reveal delay={0.1}>
            <p className="kicker text-violet">What Makes Us Different</p>
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-5">
              {DIFFERENT.map((item) => (
                <div
                  key={item.title}
                  className="group flex flex-col items-center bg-[#100716] px-4 py-7 text-center transition-colors hover:bg-[#170a21]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-lime/60 text-lime transition-all duration-300 group-hover:border-lime group-hover:shadow-[0_0_22px_-4px_rgba(182,229,29,0.6)]">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-extrabold leading-snug text-white">{item.title}</h3>
                  <p className="mt-2 text-[0.68rem] leading-relaxed text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our reach strip (reference design — confirmed figures only) */}
      <section
        className="border-b border-line"
        style={{ background: "linear-gradient(90deg, #1d0629 0%, #2e0946 45%, #1d0629 100%)" }}
        aria-label="Our reach"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <Reveal className="shrink-0">
            <h2 className="display text-3xl leading-none tracking-wide text-lime sm:text-4xl">
              Our
              <br className="hidden lg:block" /> Reach
            </h2>
          </Reveal>
          <div className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {REACH.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.06}>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-violet/60 bg-purple/20 text-violet">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="display block text-xl leading-none text-lime">{item.value}</span>
                    <span className="mt-0.5 block text-[0.7rem] font-extrabold text-white">{item.label}</span>
                    <span className="block text-[0.6rem] text-muted">{item.sub}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20" aria-label="Our mission">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="kicker">Our Mission</p>
            <p className="display mt-5 text-3xl leading-tight text-white sm:text-4xl">
              To connect diverse listeners through familiar favorites, new discoveries and
              genre-spanning shows — while giving businesses a creative way to reach{" "}
              <span className="text-gradient-lime">the right audience.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Genres */}
      <section className="border-t border-line py-20" aria-label="Genres we play">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="The Sound" title="Genres We Play" align="center" />
          <Reveal delay={0.1}>
            {/* two balanced rows of chips */}
            <div className="mt-10 space-y-3">
              {[
                siteConfig.genres.slice(0, Math.ceil(siteConfig.genres.length / 2)),
                siteConfig.genres.slice(Math.ceil(siteConfig.genres.length / 2)),
              ].map((row, i) => (
                <div key={i} className="flex flex-wrap justify-center gap-3">
                  {row.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-bold text-white transition-colors hover:border-lime hover:text-lime"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-line py-20 text-center" aria-label="Listen call to action">
        <Waveform className="absolute inset-x-0 bottom-0 h-10 opacity-25" bars={110} />
        <Reveal>
          <h2 className="display text-4xl text-white sm:text-5xl">
            Hear It For <span className="text-gradient-purple">Yourself</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4 px-4">
            <Link href="/listen" className="btn btn-lime">
              <Radio className="h-4 w-4" aria-hidden="true" /> Listen Live Now
            </Link>
            <Link href="/advertise" className="btn btn-magenta">
              <Megaphone className="h-4 w-4" aria-hidden="true" /> Partner With Us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

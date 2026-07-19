import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Users,
  Clock,
  Layers,
  Mic2,
  Smartphone,
  AudioLines,
  LayoutTemplate,
  Sparkles,
  Package,
  FileText,
  Megaphone,
  Check,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { audioSpots, websitePlacements, sponsorships, bundles, whyAdvertise } from "@/data/advertising";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { AdvertiserForm } from "@/components/forms/AdvertiserForm";
import type { AdFormat } from "@/types";

export const metadata: Metadata = {
  title: "Advertise With Us",
  description:
    "Advertise with Monsterous Radio — connect your business with a diverse 20–50 audience across the Philippines and North America through audio campaigns, show sponsorships and website placements.",
  alternates: { canonical: `${siteConfig.url}/advertise` },
};

const WHY_ICONS = [Target, Users, Clock, Layers, Mic2, Smartphone];

/** Accent color per format group, used for the header bar + list ticks. */
function FormatGroup({
  icon: Icon,
  title,
  subtitle,
  formats,
  accent,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
  title: string;
  subtitle: string;
  formats: AdFormat[];
  accent: string;
}) {
  return (
    <Reveal>
      {/* gradient panel header (reference design) */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-gradient-to-r from-[#241033] via-[#170822] to-[#110518] px-4 py-3">
        <h3 className="display flex items-center gap-3 text-lg tracking-wide text-white">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{ background: `color-mix(in srgb, ${accent} 18%, transparent)`, color: accent }}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          {title}
        </h3>
        <p className="hidden text-[0.62rem] font-semibold text-muted sm:block">{subtitle}</p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {formats.map((f) => (
          <div
            key={f.id}
            className="group flex flex-col rounded-xl border border-white/10 bg-[#150920] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet/60 hover:shadow-[0_18px_44px_-14px_rgba(83,16,122,0.6)]"
          >
            <h4 className="display text-xl text-white transition-colors group-hover:text-lime sm:text-2xl">
              {f.name}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
            <ul className="mt-4 space-y-2">
              {f.details.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-xs text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `color-mix(in srgb, ${accent} 20%, transparent)`, color: accent }}
                  >
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
            {siteConfig.showAdvertisingPrices && f.price && (
              <p className="mt-4 font-mono text-lg font-bold text-lime">{f.price}</p>
            )}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function AdvertisePage() {
  return (
    <>
      {/* Hero — purple crowd backdrop */}
      <PageHero
        kicker="Advertise With Us"
        title={
          <>
            Your Brand. Our Audience.{" "}
            <span className="text-gradient-lime">Real Results.</span>
          </>
        }
        description="Connect your business with a diverse 20–50 audience across the Philippines and North America through targeted audio campaigns, show sponsorships and high-visibility website placements."
        image="/studio/advertise-cta-bg.png"
        imagePosition="object-[center_35%]"
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/media-kit" className="btn btn-lime">
            <FileText className="h-4 w-4" aria-hidden="true" /> Request Media Kit
          </Link>
          <a href="#inquiry" className="btn btn-magenta">
            <Megaphone className="h-4 w-4" aria-hidden="true" /> Build My Campaign
          </a>
        </div>
      </PageHero>

      {/* A. Why advertise */}
      <section
        className="border-b border-line py-20"
        style={{ background: "linear-gradient(180deg, #110618 0%, #0b040f 100%)" }}
        aria-label="Why advertise"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Why Monsterous Radio"
            title="Built for Advertisers"
            description="Multi-genre programming means clearly defined audiences — and clearly defined opportunities for your brand."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyAdvertise.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <Reveal key={item.title} delay={(i % 3) * 0.08}>
                  <div className="group relative h-full overflow-hidden rounded-xl border border-white/10 bg-[#150920] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet/60 hover:shadow-[0_18px_44px_-14px_rgba(83,16,122,0.6)]">
                    {/* oversized index number */}
                    <span
                      aria-hidden="true"
                      className="display pointer-events-none absolute -right-1 -top-4 text-[4.5rem] leading-none text-white/[0.045] transition-colors duration-300 group-hover:text-lime/[0.08]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#53107a] to-[#2e0946] text-lime shadow-[0_6px_18px_-6px_rgba(83,16,122,0.8)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="display relative mt-4 text-xl text-white transition-colors group-hover:text-lime sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* B. Formats */}
      <section className="py-20" aria-label="Advertising formats">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Advertising Formats"
            title="Pick Your Frequency"
            description="Four ways in — combine them for a campaign that surrounds your audience."
          />
          <FormatGroup
            icon={AudioLines}
            title="In-Stream Audio Advertisements"
            subtitle="15 / 30 / 45 / 60-second spots inside live programming"
            formats={audioSpots}
            accent="var(--lime)"
          />
          <FormatGroup
            icon={LayoutTemplate}
            title="Website Advertising"
            subtitle="Premium banners across high-traffic pages"
            formats={websitePlacements}
            accent="var(--purple-bright)"
          />
          <FormatGroup
            icon={Sparkles}
            title="Show Sponsorship"
            subtitle="Own the show your audience already loves"
            formats={sponsorships}
            accent="var(--magenta)"
          />
          <FormatGroup
            icon={Package}
            title="Bundled Campaigns"
            subtitle="Audio + web + sponsorship, tailored to your budget"
            formats={bundles}
            accent="var(--lime-soft)"
          />

          {/* E. Rates */}
          {!siteConfig.showAdvertisingPrices && (
            <Reveal>
              <div className="relative overflow-hidden rounded-xl border border-lime/25 px-6 py-10 text-center sm:px-10">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(120deg, #1a2604 0%, #150920 45%, #2e0946 100%)" }}
                />
                <div className="relative">
                  <p className="display text-2xl text-white sm:text-3xl">
                    Contact us for the latest advertising rates and{" "}
                    <span className="text-lime">custom campaign options.</span>
                  </p>
                  <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
                    Every campaign is tailored — tell us your goals and we&apos;ll build the right mix.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-4">
                    <a href="#inquiry" className="btn btn-lime">
                      Get Current Rates
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <Link href="/media-kit" className="btn btn-magenta">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      Request Media Kit
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* D. Audience snapshot */}
      <section
        className="border-y border-line py-20"
        style={{ background: "linear-gradient(180deg, #110618 0%, #0b040f 100%)" }}
        aria-label="Audience snapshot"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="Audience Snapshot" title="Who You'll Reach" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Primary Regions", value: "Philippines & North America" },
              { label: "Primary Age Range", value: "20–50" },
              { label: "Musical Interests", value: "12+ Genres, Every Era" },
              { label: "Listening Devices", value: "Mobile & Desktop" },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <div className="group h-full rounded-xl border border-white/10 bg-[#150920] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-lime/40">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-violet">
                    {item.label}
                  </p>
                  <p className="display mt-3 text-2xl text-white transition-colors group-hover:text-lime">
                    {item.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted/70">
            Detailed audience analytics available on request once verified figures are confirmed.
          </p>
        </div>
      </section>

      {/* F + G. CTA + form */}
      <section
        id="inquiry"
        className="scroll-mt-28 py-20"
        aria-label="Advertising inquiry form"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            kicker="Start a Campaign"
            title="Let's Put Your Brand in the Mix"
            description="Tell us about your business and goals — the team will reply with current rates, availability and a tailored proposal."
            align="center"
          />
          <div className="mt-12">
            <AdvertiserForm />
          </div>
        </div>
      </section>
    </>
  );
}

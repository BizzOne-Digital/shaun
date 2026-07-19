import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail, Radio, Globe2, Users, AudioLines, Sparkles, LayoutTemplate, Megaphone } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { shows } from "@/data/shows";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";

export const metadata: Metadata = {
  title: "Media Kit",
  description:
    "Monsterous Radio media kit — station overview, programming, audience, advertising formats and sponsorship opportunities for brands and agencies.",
  alternates: { canonical: `${siteConfig.url}/media-kit` },
};

const OVERVIEW = [
  {
    icon: Radio,
    title: "Station Overview",
    text: "Monsterous Radio is an international 24/7 online radio station combining mainstream hits with specialty programming — from the 1960s through today.",
  },
  {
    icon: AudioLines,
    title: "Programming",
    text: `${shows.length}+ named shows across Pop, Rock, Lite Rock, Reggae, House, Christian Contemporary and more, plus round-the-clock monster hits programming.`,
  },
  {
    icon: Globe2,
    title: "Regions Served",
    text: "Primary markets in the Philippines and North America, with global availability through the online stream.",
  },
  {
    icon: Users,
    title: "Audience",
    text: "A diverse 20–50 age range of engaged music listeners on mobile and desktop devices.",
  },
];

const FORMATS = [
  {
    icon: AudioLines,
    title: "In-Stream Audio",
    text: "15, 30, 45 and 60-second spots inside approved programming windows.",
  },
  {
    icon: Sparkles,
    title: "Show Sponsorship",
    text: "'Presented by' branding, show-page placement and campaign mentions.",
  },
  {
    icon: LayoutTemplate,
    title: "Website Placements",
    text: "Premium top banner, player placement, sidebar, vertical and footer positions.",
  },
  {
    icon: Megaphone,
    title: "Bundled Campaigns",
    text: "Audio + web combinations with monthly and quarterly options.",
  },
];

export default function MediaKitPage() {
  const available = siteConfig.mediaKitAvailable;

  return (
    <>
      <PageHero
        kicker="For Brands & Agencies"
        title={
          <>
            The <span className="text-gradient-lime">Media Kit</span>
          </>
        }
        description="Everything you need to evaluate Monsterous Radio as a partner — programming, audience, formats and sponsorship opportunities."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {available ? (
            <a href={siteConfig.mediaKitUrl} download className="btn btn-lime">
              <Download className="h-4 w-4" aria-hidden="true" /> Download Media Kit (PDF)
            </a>
          ) : (
            <>
              <span
                className="btn cursor-not-allowed border border-line text-muted opacity-70"
                aria-disabled="true"
                title="The PDF media kit is being finalized"
              >
                <Download className="h-4 w-4" aria-hidden="true" /> PDF Coming Soon
              </span>
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Media%20Kit%20Request%20—%20Monsterous%20Radio`}
                className="btn btn-lime"
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> Request by Email
              </a>
            </>
          )}
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-label="Station overview">
        <SectionHeading kicker="At a Glance" title="Station Snapshot" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {OVERVIEW.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.08}>
              <div className="card-surface h-full rounded-2xl p-7">
                <item.icon className="h-6 w-6 text-lime" aria-hidden="true" />
                <h3 className="display mt-4 text-2xl text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/40 py-20" aria-label="Advertising formats">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Opportunities"
            title="Ways to Partner"
            description="Current rates are provided directly — request the kit or start an inquiry and the team will respond with the latest options."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FORMATS.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="card-surface h-full rounded-2xl p-6">
                  <f.icon className="h-5 w-5 text-magenta" aria-hidden="true" />
                  <h3 className="display mt-3 text-xl text-white">{f.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6" aria-label="Contact call to action">
        <Reveal>
          <h2 className="display text-4xl text-white sm:text-5xl">
            Ready to Talk <span className="text-gradient-purple">Numbers?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Reach the team directly for current rates, availability and custom campaign design.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/advertise#inquiry" className="btn btn-lime">
              <Megaphone className="h-4 w-4" aria-hidden="true" /> Start an Inquiry
            </Link>
            <a href={`mailto:${siteConfig.contact.email}`} className="btn btn-outline">
              <Mail className="h-4 w-4" aria-hidden="true" /> {siteConfig.contact.email}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

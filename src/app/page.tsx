import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Megaphone, Radio } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { Hero } from "@/components/home/Hero";
import { LiveNow } from "@/components/home/LiveNow";
import { HomeGrid } from "@/components/home/HomeGrid";
import { TodaySchedule } from "@/components/home/TodaySchedule";
import { GenreUniverse } from "@/components/home/GenreUniverse";
import { StatsSection } from "@/components/home/StatsSection";
import { TopBannerAd } from "@/components/advertising";
import { Reveal } from "@/components/animations/Reveal";
import { Mascot } from "@/components/ui/Mascot";
import { Waveform } from "@/components/animations/Waveform";
import { getCmsPage, getSection } from "@/lib/cms/content";
import { resolveCmsImage } from "@/lib/cms/resolveImage";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const page = await getCmsPage("home");
  const hero = getSection(page, "hero");
  const listenPromo = getSection(page, "listen-promo");
  const advertiseCta = getSection(page, "advertise-cta");
  const advertiseImage = resolveCmsImage(
    advertiseCta?.image || "/studio/hero-mic.png",
    "/studio/hero-mic.png",
  );

  return (
    <>
      <TopBannerAd className="pt-[110px]" />

      <Hero
        image={hero?.image || "/studio/hero-mic.png"}
        headline={hero?.headline}
        body={hero?.body}
        ctaLabel={hero?.ctaLabel || "Listen Live"}
        ctaHref={hero?.ctaHref || "/listen"}
      />

      <LiveNow />
      <HomeGrid />
      <TodaySchedule />
      <GenreUniverse />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8" aria-label="Listen live promotion">
        <Reveal>
          <div className="noir-gradient grain relative overflow-hidden rounded-3xl border border-line px-6 py-12 sm:px-12">
            <Waveform className="absolute inset-x-0 bottom-0 h-10 opacity-30" bars={120} />
            <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
              <Mascot className="h-36 w-36 shrink-0 md:h-44 md:w-44" />
              <div className="flex-1">
                <p className="kicker">{listenPromo?.body || "We're On Air 24/7"}</p>
                <h2 className="display mt-3 text-4xl text-white sm:text-5xl">
                  {listenPromo?.headline || "The Monster Never Sleeps"}
                </h2>
                <p className="accent-script mt-3 text-2xl text-limesoft">
                  {listenPromo?.subheadline || siteConfig.tagline}
                </p>
              </div>
              <Link href={listenPromo?.ctaHref || "/listen"} className="btn btn-lime shrink-0">
                <Radio className="h-4 w-4" aria-hidden="true" />
                {listenPromo?.ctaLabel || "Start Listening"}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8" aria-label="Advertise with Monsterous Radio">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <div className="absolute inset-0" aria-hidden="true">
              <Image
                src={advertiseImage}
                alt=""
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="-scale-x-100 object-cover object-[25%_center]"
                unoptimized={advertiseImage.startsWith("/api/uploads/")}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(8,3,13,0.25) 0%, rgba(8,3,13,0.82) 32%, rgba(8,3,13,0.92) 60%, rgba(8,3,13,0.78) 100%)",
                }}
              />
              <div className="absolute inset-0 bg-black/45 md:hidden" />
            </div>

            <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-10 sm:px-10 md:flex-row md:items-center md:pl-[30%] lg:pl-[26%]">
              <div className="min-w-0 flex-1">
                <h2 className="display text-2xl tracking-wide text-white sm:text-3xl">
                  {advertiseCta?.headline || "Advertise With Us"}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
                  {advertiseCta?.body ||
                    "Reach thousands of engaged listeners 24/7. Promote your brand with Monsterous Radio."}
                </p>
              </div>
              <Link
                href={advertiseCta?.ctaHref || "/advertise"}
                className="btn shrink-0 border border-lime bg-lime/10 !px-6 !py-3 text-xs text-lime hover:bg-lime hover:text-black"
              >
                {advertiseCta?.ctaLabel || "View Advertising Packages"}
              </Link>
              <Megaphone
                aria-hidden="true"
                className="hidden h-16 w-16 shrink-0 -rotate-12 text-violet/70 lg:block"
                strokeWidth={1.2}
              />
            </div>
          </div>
        </Reveal>
      </section>

      <StatsSection />
    </>
  );
}

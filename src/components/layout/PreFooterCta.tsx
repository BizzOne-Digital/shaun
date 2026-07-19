import Link from "next/link";
import Image from "next/image";
import { Megaphone, ArrowUpRight } from "lucide-react";

/**
 * Purple crowd background lives at: public/studio/advertise-cta-bg.png
 * Set to false to fall back to the plain purple gradient.
 */
const HAS_BG_IMAGE = true;

/**
 * Pre-footer conversion banner (client reference design):
 * "REACH THOUSANDS. GROW YOUR BRAND." — shown site-wide above the footer.
 */
export function PreFooterCta() {
  return (
    <section aria-label="Advertise with Monsterous Radio" className="relative overflow-hidden">
      {/* background — gradient base + crowd image on top */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, #3a0b57 0%, #53107a 50%, #2a0740 100%)" }}
      />
      {HAS_BG_IMAGE && (
        <Image
          src="/studio/advertise-cta-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_72%]"
          aria-hidden="true"
        />
      )}
      {/* soft left-side scrim so the copy stays readable over the crowd */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,3,16,0.55) 0%, rgba(10,3,16,0.35) 45%, rgba(10,3,16,0.15) 100%)",
        }}
      />
      {/* bottom fade so the banner merges into the footer below */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(5,4,7,0.55) 55%, rgba(5,4,7,0.96) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        {/* megaphone badge */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime text-black shadow-[0_0_24px_rgba(182,229,29,0.45)]">
          <Megaphone className="h-6 w-6" aria-hidden="true" />
        </span>

        {/* copy */}
        <div className="min-w-0 flex-1">
          <h2 className="display text-xl tracking-wide text-white sm:text-2xl">
            Reach Thousands. <span className="text-lime">Grow Your Brand.</span>
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/85 sm:text-sm">
            Advertise with Monsterous Radio and connect with a loyal, engaged audience across
            multiple genres and platforms.
          </p>
        </div>

        {/* actions */}
        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          <Link href="/media-kit" className="btn btn-lime !px-6 !py-3 text-xs">
            Request Media Kit
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="text-[0.68rem] text-white/75">
            or{" "}
            <Link href="/contact" className="font-bold text-lime underline-offset-2 hover:underline">
              Contact Us
            </Link>{" "}
            to Get Started
          </p>
        </div>
      </div>
    </section>
  );
}

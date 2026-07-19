import type { ReactNode } from "react";
import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/animations/Reveal";
import { Waveform } from "@/components/animations/Waveform";

interface PageHeroProps {
  kicker: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
  /** Optional full-bleed background photo (path under /public). */
  image?: string;
  /** Tailwind object-position class for the background photo. */
  imagePosition?: string;
}

/** Shared cinematic hero for inner pages. */
export function PageHero({
  kicker,
  title,
  description,
  children,
  compact,
  image,
  imagePosition = "object-[70%_center]",
}: PageHeroProps) {
  return (
    <section
      className={`${image ? "" : "noir-gradient"} grain relative overflow-hidden ${compact ? "pt-[140px] pb-10" : "pt-[160px] pb-16"}`}
    >
      {image ? (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover ${imagePosition}`}
          />
          {/* readability overlays — dark from the left, vignette top/bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,4,7,0.92) 0%, rgba(5,4,7,0.78) 32%, rgba(5,4,7,0.4) 62%, rgba(5,4,7,0.12) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,4,7,0.85) 0%, transparent 32%, transparent 60%, rgba(5,4,7,0.94) 100%)",
            }}
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[10%] h-[420px] w-[420px] rounded-full opacity-[0.16] blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--purple-bright), transparent 70%)" }}
        />
      )}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Stagger>
          <StaggerItem>
            <p className="kicker">{kicker}</p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="display mt-4 max-w-4xl text-[clamp(2.6rem,7vw,5.2rem)] text-white">{title}</h1>
          </StaggerItem>
          {description && (
            <StaggerItem>
              <p className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${image ? "text-white/80" : "text-muted"}`}>
                {description}
              </p>
            </StaggerItem>
          )}
          {children && <StaggerItem>{children}</StaggerItem>}
        </Stagger>
      </div>
      <Waveform className="relative z-10 mt-10 h-8 w-full opacity-40" bars={110} color="var(--purple-bright)" />
    </section>
  );
}

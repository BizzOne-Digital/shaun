import Image from "next/image";
import { resolveCmsImage } from "@/lib/cms/resolveImage";

interface ArtProps {
  from: string;
  to: string;
  accent: string;
  word: string;
  sub?: string;
}

interface ShowArtworkProps {
  art: ArtProps;
  image?: string;
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Show cover renderer. Uses the supplied artwork file when available,
 * otherwise generates a premium typographic cover from CSS —
 * no stock photos, ever.
 */
export function ShowArtwork({ art, image, name, className = "", sizes, priority }: ShowArtworkProps) {
  const resolved = image ? resolveCmsImage(image, "") : "";

  if (resolved) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={resolved}
          alt={`${name} show artwork`}
          fill
          sizes={sizes ?? "(max-width: 768px) 60vw, 320px"}
          priority={priority}
          className="object-cover"
          unoptimized={resolved.startsWith("/api/uploads/")}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} show artwork`}
      className={`relative flex flex-col items-start justify-end overflow-hidden p-[8%] ${className}`}
      style={{
        background: `linear-gradient(150deg, ${art.from} 0%, ${art.to} 78%)`,
        containerType: "inline-size",
      }}
    >
      {/* frequency lines texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 7px, ${art.accent} 7px, ${art.accent} 8px)`,
        }}
      />
      {/* glow orb */}
      <div
        aria-hidden="true"
        className="absolute -right-1/4 -top-1/4 h-2/3 w-2/3 rounded-full opacity-30 blur-2xl"
        style={{ background: art.accent }}
      />
      <span
        aria-hidden="true"
        className="display relative z-10 block text-[clamp(1.1rem,18cqw,2.6rem)] leading-[0.92]"
        style={{ color: art.accent }}
      >
        {art.word}
      </span>
      {art.sub && (
        <span
          aria-hidden="true"
          className="display relative z-10 mt-1 block text-[clamp(0.8rem,11cqw,1.7rem)] leading-none text-white/90"
        >
          {art.sub}
        </span>
      )}
      <span
        aria-hidden="true"
        className="relative z-10 mt-[6%] block h-[3px] w-2/5 rounded-full"
        style={{ background: art.accent }}
      />
      <span className="relative z-10 mt-[5%] text-[0.55rem] font-bold uppercase tracking-[0.3em] text-white/60">
        Monsterous Radio
      </span>
    </div>
  );
}

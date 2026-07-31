"use client";

import Image from "next/image";
import { useSiteConfig } from "@/providers/SiteConfigProvider";
import { resolveCmsImage } from "@/lib/cms/resolveImage";

/**
 * Monsterous Radio mascot — CMS mascot URL when set, else /brand/monster.png.
 */
export function Mascot({ className = "", glow = true }: { className?: string; glow?: boolean }) {
  const siteConfig = useSiteConfig();
  const src = resolveCmsImage(siteConfig.mascotUrl, "/brand/monster.png");

  return (
    <span className={`relative inline-block ${className}`}>
      {glow && (
        <span
          aria-hidden="true"
          className="absolute inset-[-12%] rounded-full opacity-40 blur-2xl"
          style={{ background: "radial-gradient(circle, var(--purple-bright), transparent 70%)" }}
        />
      )}
      <Image
        src={src}
        alt={`${siteConfig.name} monster mascot`}
        fill
        sizes="(max-width: 768px) 40vw, 300px"
        className="relative object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
        unoptimized={src.startsWith("/api/uploads/")}
      />
    </span>
  );
}

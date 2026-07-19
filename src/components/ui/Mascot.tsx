import Image from "next/image";

/**
 * Monsterous Radio mascot — renders the client-supplied artwork from
 * public/brand/monster.png with an optional purple studio glow.
 * Size it with height/width classes, e.g. <Mascot className="h-36 w-36" />.
 */
export function Mascot({ className = "", glow = true }: { className?: string; glow?: boolean }) {
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
        src="/brand/monster.png"
        alt="Monsterous Radio monster mascot"
        fill
        sizes="(max-width: 768px) 40vw, 300px"
        className="relative object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
      />
    </span>
  );
}

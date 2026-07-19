import Link from "next/link";

/** Compact gradient section header used on the reference-style content grids. */
export function PanelHeader({
  title,
  href,
  linkLabel,
  sub,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-gradient-to-r from-[#241033] via-[#170822] to-[#110518] px-4 py-2.5">
      <h2 className="display flex items-center gap-2.5 text-lg tracking-wide text-white">
        <span aria-hidden="true" className="h-4 w-1 rounded-full bg-magenta" />
        {title}
        {sub && (
          <span className="hidden text-[0.62rem] font-semibold normal-case tracking-normal text-muted sm:inline">
            {sub}
          </span>
        )}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="shrink-0 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-lime transition-colors hover:text-limesoft"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import type { AdCampaign, AdPlacement } from "@/types";

export interface AdSlotProps {
  placement: AdPlacement;
  campaign?: AdCampaign | null;
  width: number;
  height: number;
  /** When no active campaign: show "Advertise Here" placeholder or collapse */
  showPlaceholder?: boolean;
  /** Optional compact aspect ratio for the placeholder only (e.g. "300 / 110") */
  placeholderRatio?: string;
  className?: string;
  label?: string;
}

function campaignIsLive(c: AdCampaign): boolean {
  if (!c.active) return false;
  const now = Date.now();
  if (c.startDate && now < new Date(c.startDate).getTime()) return false;
  if (c.endDate && now > new Date(c.endDate).getTime()) return false;
  return true;
}

/**
 * Universal advertisement slot. Renders the active campaign creative,
 * a premium "Advertise Here" placeholder, or collapses entirely.
 */
export function AdSlot({
  placement,
  campaign,
  width,
  height,
  showPlaceholder = true,
  placeholderRatio,
  className = "",
  label = "Advertisement",
}: AdSlotProps) {
  const live = campaign && campaignIsLive(campaign);

  if (!live && !showPlaceholder) return null;

  const ratio = `${width} / ${height}`;

  if (live && campaign) {
    const creative = campaign.image ? (
      <Image
        src={campaign.image}
        alt={campaign.alt}
        width={width}
        height={height}
        className="h-auto w-full object-contain"
      />
    ) : (
      <div
        className="flex h-full w-full items-center justify-center bg-elevated text-sm font-bold text-white"
        style={{ aspectRatio: ratio }}
      >
        {campaign.sponsorName}
      </div>
    );

    return (
      <div className={`mx-auto w-full ${className}`} style={{ maxWidth: width }} data-placement={placement}>
        <p className="mb-1 text-center text-[0.6rem] uppercase tracking-[0.3em] text-muted/70">{label}</p>
        {campaign.url ? (
          <a
            href={campaign.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${campaign.sponsorName} — ${campaign.alt} (opens in a new tab)`}
            className="block overflow-hidden rounded-lg border border-line transition-transform hover:scale-[1.01]"
          >
            {creative}
          </a>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line">{creative}</div>
        )}
      </div>
    );
  }

  // Premium placeholder
  return (
    <div className={`mx-auto w-full ${className}`} style={{ maxWidth: width }} data-placement={placement}>
      <Link
        href="/advertise"
        aria-label={`Advertise here — ${width} by ${height} ${placement} placement`}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg border border-dashed border-white/15 bg-surface/60 transition-colors hover:border-violet/60"
        style={{ aspectRatio: placeholderRatio ?? ratio, minHeight: 48 }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05] transition-opacity group-hover:opacity-[0.12]"
          style={{ background: "linear-gradient(120deg, var(--purple-bright), var(--magenta))" }}
        />
        <Megaphone className="h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-muted transition-colors group-hover:text-white sm:text-xs">
          Advertise Here · {width}×{height}
        </span>
      </Link>
    </div>
  );
}

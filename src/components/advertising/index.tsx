import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AdSlot } from "./AdSlot";
import { siteConfig } from "@/config/siteConfig";
import type { AdCampaign } from "@/types";

/** 970×90 premium banner used at the top of pages. */
export function TopBannerAd({ campaign, className = "" }: { campaign?: AdCampaign | null; className?: string }) {
  const cfg = siteConfig.adSlots.topBanner;
  if (!cfg.enabled) return null;
  return (
    <AdSlot
      placement="top-banner"
      campaign={campaign}
      width={970}
      height={90}
      showPlaceholder={cfg.showPlaceholder}
      className={className}
      label="Advertisement — Top Banner"
    />
  );
}

/** 300×250 sidebar placement. */
export function SidebarAd({ campaign, className = "" }: { campaign?: AdCampaign | null; className?: string }) {
  const cfg = siteConfig.adSlots.sidebar;
  if (!cfg.enabled) return null;
  return (
    <AdSlot
      placement="sidebar"
      campaign={campaign}
      width={300}
      height={250}
      showPlaceholder={cfg.showPlaceholder}
      placeholderRatio="300 / 100"
      className={className}
      label="Advertisement"
    />
  );
}

/** Compact placement rendered beside the radio player. */
export function PlayerAd({ campaign }: { campaign?: AdCampaign | null }) {
  const cfg = siteConfig.adSlots.player;
  if (!cfg.enabled) return null;
  return (
    <AdSlot
      placement="player"
      campaign={campaign}
      width={320}
      height={50}
      showPlaceholder={cfg.showPlaceholder}
      label="Sponsor"
    />
  );
}

/** 970×90 footer banner. */
export function FooterAd({ campaign, className = "" }: { campaign?: AdCampaign | null; className?: string }) {
  const cfg = siteConfig.adSlots.footer;
  if (!cfg.enabled) return null;
  return (
    <AdSlot
      placement="footer"
      campaign={campaign}
      width={970}
      height={90}
      showPlaceholder={cfg.showPlaceholder}
      className={className}
      label="Advertisement — Footer Banner"
    />
  );
}

/** Small "Presented by" badge for sponsored shows/sections. */
export function SponsorBadge({ campaign }: { campaign?: AdCampaign | null }) {
  if (!campaign?.active) return null;
  const inner = (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
      <Sparkles className="h-3.5 w-3.5 text-lime" aria-hidden="true" />
      Presented by <strong className="text-white">{campaign.sponsorName}</strong>
    </span>
  );
  return campaign.url ? (
    <a href={campaign.url} target="_blank" rel="noopener noreferrer" aria-label={`${campaign.sponsorName} website (opens in a new tab)`}>
      {inner}
    </a>
  ) : (
    inner
  );
}

/** Show-page sponsorship area: live sponsor badge or an invitation to sponsor. */
export function ShowSponsor({ campaign, showName }: { campaign?: AdCampaign | null; showName: string }) {
  if (campaign?.active) {
    return (
      <div className="card-surface flex items-center justify-between gap-4 rounded-2xl p-5">
        <SponsorBadge campaign={campaign} />
      </div>
    );
  }
  return (
    <div className="card-surface relative overflow-hidden rounded-2xl p-6">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--magenta)" }}
      />
      <p className="kicker">Sponsorship Available</p>
      <h3 className="display mt-2 text-2xl text-white">Sponsor {showName}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        Put your brand in front of this show&apos;s dedicated audience with &ldquo;Presented
        by&rdquo; branding, campaign mentions and placement on this page.
      </p>
      <Link href="/advertise" className="btn btn-magenta mt-5">
        Sponsor This Show
      </Link>
    </div>
  );
}

export { AdSlot };

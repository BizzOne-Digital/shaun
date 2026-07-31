"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Radio, Megaphone } from "lucide-react";
import { FacebookIcon } from "@/components/ui/BrandIcons";
import { useSiteConfig } from "@/providers/SiteConfigProvider";
import { resolveCmsImage } from "@/lib/cms/resolveImage";
import { Waveform } from "@/components/animations/Waveform";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const QUICK_LINKS = [
  { href: "/listen", label: "Listen Live" },
  { href: "/shows", label: "Shows & Schedule" },
  { href: "/events", label: "Concerts & Events" },
  { href: "/news", label: "News & Features" },
  { href: "/advertise", label: "Advertise With Us" },
  { href: "/media-kit", label: "Media Kit" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const siteConfig = useSiteConfig();
  const logoSrc = resolveCmsImage(siteConfig.logoUrl, "/brand/logo.png");

  return (
    <footer className="relative border-t border-line bg-black/60">
      <PreFooterCta />
      <Waveform className="h-10 w-full opacity-40" color="var(--purple-bright)" bars={110} />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Image
            src={logoSrc}
            alt={`${siteConfig.name} logo`}
            width={180}
            height={68}
            className="h-14 w-auto object-contain"
            unoptimized={logoSrc.startsWith("/api/uploads/")}
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          <p className="accent-script mt-4 text-2xl text-limesoft">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Footer navigation">
          <h3 className="kicker">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted transition-colors hover:text-lime">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="kicker">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a href={siteConfig.contact.phoneHref} className="flex items-center gap-2.5 hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2.5 break-all hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white"
                aria-label={`${siteConfig.name} on Facebook (opens in a new tab)`}
              >
                <FacebookIcon className="h-4 w-4 shrink-0 text-lime" />
                facebook.com/monsterousradio
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Radio className="h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
              {siteConfig.contact.hoursLabel}
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted/70">{siteConfig.contact.locationLabel}</p>
          <Link href="/advertise" className="btn btn-magenta mt-5 !px-5 !py-2.5 text-[0.68rem]">
            <Megaphone className="h-4 w-4" aria-hidden="true" />
            Advertising Inquiry
          </Link>
        </div>

        <div>
          <h3 className="kicker">Stay Tuned</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Get show updates, station news and advertiser opportunities in your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted/70 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

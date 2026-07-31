import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, Clock, MapPin, Megaphone } from "lucide-react";
import { FacebookIcon } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/config/siteConfig";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/animations/Reveal";
import { getCmsPage, getSection } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Monsterous Radio — listener messages, advertising inquiries, show submissions, partnerships and technical support. Serving the Philippines and North America 24/7.",
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const page = await getCmsPage("contact");
  const hero = getSection(page, "hero");

  return (
    <>
      <PageHero
        kicker="Get in Touch"
        title={hero?.headline || (
          <>
            Let&apos;s <span className="text-gradient-lime">Connect</span>
          </>
        )}
        description={
          hero?.body ||
          "A question, a campaign, a show idea or a partnership — pick your path and the right person will get back to you."
        }
        image={hero?.image || "/studio/contact-hero.png"}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_minmax(300px,380px)] lg:px-8" aria-label="Contact form and details">
        <ContactForm />

        <div className="space-y-6">
          <Reveal delay={0.1}>
            <div className="card-surface rounded-2xl p-7">
              <h2 className="kicker">Contact Details</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <a href={siteConfig.contact.phoneHref} className="flex items-center gap-3 text-white transition-colors hover:text-lime">
                    <Phone className="h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 break-all text-white transition-colors hover:text-lime">
                    <Mail className="h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contact.emailAlt}`} className="flex items-center gap-3 break-all text-muted transition-colors hover:text-white">
                    <Mail className="h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
                    {siteConfig.contact.emailAlt}{" "}
                    <span className="text-[0.6rem] uppercase tracking-widest text-muted/60">(alt)</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted">
                  <Clock className="h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                  {siteConfig.contact.hoursLabel}
                </li>
                <li className="flex items-center gap-3 text-muted">
                  <MapPin className="h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
                  {siteConfig.contact.locationLabel}
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface group flex items-center gap-4 rounded-2xl p-6 transition-colors hover:border-violet/60"
              aria-label="Monsterous Radio on Facebook (opens in a new tab)"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-purple/25">
                <FacebookIcon className="h-5 w-5 text-violet" />
              </span>
              <span>
                <span className="block font-bold text-white group-hover:text-lime">Follow on Facebook</span>
                <span className="block text-xs text-muted">facebook.com/monsterousradio</span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="card-surface relative overflow-hidden rounded-2xl p-7">
              <div
                aria-hidden="true"
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl"
                style={{ background: "var(--magenta)" }}
              />
              <h2 className="kicker !text-magenta">Advertising?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Use the dedicated advertiser inquiry for faster routing, media kit access and
                campaign options.
              </p>
              <Link href="/advertise#inquiry" className="btn btn-magenta mt-5 !px-5 !py-2.5 text-[0.68rem]">
                <Megaphone className="h-4 w-4" aria-hidden="true" /> Advertising Inquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

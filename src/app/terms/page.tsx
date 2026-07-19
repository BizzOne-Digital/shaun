import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the Monsterous Radio website and live stream.",
  alternates: { canonical: `${siteConfig.url}/terms` },
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Use of This Website",
    body: [
      "The Monsterous Radio website and live stream are provided for personal, non-commercial listening and information. You may not rebroadcast, redistribute or commercially exploit the stream or site content without written permission.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "The Monsterous Radio name, logo, mascot, show names and artwork are the property of Monsterous Radio. Music broadcast on the station remains the property of its respective rights holders.",
    ],
  },
  {
    title: "Program Schedule",
    body: [
      "Programming and schedules are subject to change without notice. Show information on this site is provided for convenience and may be updated at any time.",
    ],
  },
  {
    title: "Advertising",
    body: [
      "Advertising placements, sponsorships and rates are subject to availability and written agreement. Submitting an inquiry through this website does not constitute a binding commitment by either party.",
    ],
  },
  {
    title: "Disclaimer",
    body: [
      "The website and stream are provided on an 'as is' basis. While we aim for 24/7 availability, we do not guarantee uninterrupted service and are not liable for outages, interruptions or third-party content.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Questions about these terms can be sent to ${siteConfig.contact.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Terms of Use" compact />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-sm text-muted">
          By using the Monsterous Radio website and live stream, you agree to the following terms.
        </p>
        <div className="mt-10 space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="display text-2xl text-white">{s.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-muted/70">Last updated: July 2026</p>
      </section>
    </>
  );
}

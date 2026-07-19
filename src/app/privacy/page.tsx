import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the Monsterous Radio website.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Information We Collect",
    body: [
      "When you use our contact or advertising forms, we collect the information you provide — such as your name, email address, phone number and message — solely to respond to your inquiry.",
      "We do not require an account to listen to the stream, and we do not collect payment information through this website.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "Information submitted through our forms is used to respond to your inquiry, discuss advertising opportunities or provide requested materials such as our media kit.",
      "If you subscribe to station updates, we use your email address only to send those updates. You can unsubscribe at any time by contacting us.",
    ],
  },
  {
    title: "Cookies & Analytics",
    body: [
      "This website may use basic analytics to understand how visitors use the site — such as which pages are viewed and how listeners access the stream. This data is aggregated and does not personally identify you.",
    ],
  },
  {
    title: "Third-Party Links",
    body: [
      "Our website may contain links to advertiser websites, social media platforms and ticketing services. We are not responsible for the privacy practices of those external sites.",
    ],
  },
  {
    title: "Data Sharing",
    body: [
      "We do not sell your personal information. Form submissions are delivered to the station team by email and are not shared with third parties except where required to respond to your request.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      `Questions about this policy can be sent to ${siteConfig.contact.email} or by phone at ${siteConfig.contact.phone}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Privacy Policy" compact />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-sm text-muted">
          Monsterous Radio respects your privacy. This policy explains what information we collect
          through this website and how it is used.
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

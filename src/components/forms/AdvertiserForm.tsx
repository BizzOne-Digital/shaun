"use client";

import { type FormEvent } from "react";
import { Loader2, Megaphone } from "lucide-react";
import { useFormSubmit } from "./useFormSubmit";
import { FormShell } from "./FormShell";
import { shows } from "@/data/shows";

const CAMPAIGN_TYPES = [
  "In-Stream Audio Spots",
  "Show Sponsorship",
  "Website Banner Placement",
  "Bundled Campaign",
  "Custom / Not Sure Yet",
];

const BUDGETS = [
  "Under $250 / month",
  "$250 – $500 / month",
  "$500 – $1,000 / month",
  "$1,000+ / month",
  "Prefer to discuss",
];

export function AdvertiserForm() {
  const { status, errorMessage, fieldErrors, submit, reset } = useFormSubmit();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    submit({
      formType: "advertising",
      name: String(fd.get("name") ?? ""),
      businessName: String(fd.get("businessName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      website: String(fd.get("website") ?? ""),
      targetAudience: String(fd.get("targetAudience") ?? ""),
      preferredShow: String(fd.get("preferredShow") ?? ""),
      campaignType: String(fd.get("campaignType") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      startDate: String(fd.get("startDate") ?? ""),
      message: String(fd.get("message") ?? ""),
      company_website: String(fd.get("company_website") ?? ""),
    });
  };

  return (
    <FormShell
      status={status}
      errorMessage={errorMessage}
      successTitle="Inquiry Received!"
      successText="Thanks for your interest in advertising with Monsterous Radio. Our team will reply with current rates, availability and a campaign proposal."
      onReset={reset}
    >
      <form onSubmit={onSubmit} className="card-surface relative rounded-2xl p-6 sm:p-8" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="af-name" className="form-label">
              Full Name *
            </label>
            <input id="af-name" name="name" required minLength={2} className={`field ${fieldErrors.name ? "field-error" : ""}`} autoComplete="name" />
            {fieldErrors.name && <p className="mt-1 text-xs text-magenta">{fieldErrors.name[0]}</p>}
          </div>
          <div>
            <label htmlFor="af-business" className="form-label">
              Business Name
            </label>
            <input id="af-business" name="businessName" className="field" autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="af-email" className="form-label">
              Email *
            </label>
            <input id="af-email" name="email" type="email" required className={`field ${fieldErrors.email ? "field-error" : ""}`} autoComplete="email" />
            {fieldErrors.email && <p className="mt-1 text-xs text-magenta">{fieldErrors.email[0]}</p>}
          </div>
          <div>
            <label htmlFor="af-phone" className="form-label">
              Phone
            </label>
            <input id="af-phone" name="phone" type="tel" className="field" autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="af-website" className="form-label">
              Website
            </label>
            <input id="af-website" name="website" type="url" placeholder="https://" className="field" autoComplete="url" />
          </div>
          <div>
            <label htmlFor="af-audience" className="form-label">
              Target Audience
            </label>
            <input id="af-audience" name="targetAudience" placeholder="e.g. young professionals in Manila" className="field" />
          </div>
          <div>
            <label htmlFor="af-show" className="form-label">
              Preferred Show
            </label>
            <select id="af-show" name="preferredShow" className="field" defaultValue="">
              <option value="">No preference</option>
              {shows.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="af-type" className="form-label">
              Campaign Type
            </label>
            <select id="af-type" name="campaignType" className="field" defaultValue={CAMPAIGN_TYPES[0]}>
              {CAMPAIGN_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="af-budget" className="form-label">
              Approximate Budget
            </label>
            <select id="af-budget" name="budget" className="field" defaultValue="">
              <option value="">Select a range</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="af-start" className="form-label">
              Campaign Start Date
            </label>
            <input id="af-start" name="startDate" type="date" className="field" />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="af-message" className="form-label">
            Tell Us About Your Goals *
          </label>
          <textarea
            id="af-message"
            name="message"
            required
            minLength={5}
            rows={5}
            placeholder="What are you promoting, and what does success look like?"
            className={`field resize-y ${fieldErrors.message ? "field-error" : ""}`}
          />
          {fieldErrors.message && <p className="mt-1 text-xs text-magenta">{fieldErrors.message[0]}</p>}
        </div>

        {/* Honeypot — hidden from humans */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="af-hp">Leave this field empty</label>
          <input id="af-hp" name="company_website" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" disabled={status === "loading"} className="btn btn-lime mt-6 w-full disabled:opacity-60 sm:w-auto">
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Megaphone className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "loading" ? "Sending…" : "Submit Advertising Inquiry"}
        </button>
      </form>
    </FormShell>
  );
}

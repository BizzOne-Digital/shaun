"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { useFormSubmit } from "./useFormSubmit";
import { FormShell } from "./FormShell";

const INQUIRY_TYPES = [
  "Listener Message",
  "Advertising Inquiry",
  "Show Submission",
  "Partnership",
  "Technical Support",
] as const;

export function ContactForm({ defaultInquiry }: { defaultInquiry?: string }) {
  const { status, errorMessage, fieldErrors, submit, reset } = useFormSubmit();
  const [inquiryType, setInquiryType] = useState(defaultInquiry ?? INQUIRY_TYPES[0]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    submit({
      formType: "contact",
      inquiryType,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      company_website: String(fd.get("company_website") ?? ""),
    });
  };

  return (
    <FormShell
      status={status}
      errorMessage={errorMessage}
      successTitle="Message Sent!"
      successText="Thanks for reaching out to Monsterous Radio. Our team will get back to you as soon as possible."
      onReset={reset}
    >
      <form onSubmit={onSubmit} className="card-surface rounded-2xl p-6 sm:p-8" noValidate>
        <fieldset>
          <legend className="form-label !mb-3">What is this about?</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Inquiry type">
            {INQUIRY_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={inquiryType === t}
                onClick={() => setInquiryType(t)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                  inquiryType === t
                    ? "border-lime bg-lime/15 text-lime"
                    : "border-line text-muted hover:border-violet hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="form-label">
              Full Name *
            </label>
            <input id="cf-name" name="name" required minLength={2} className={`field ${fieldErrors.name ? "field-error" : ""}`} autoComplete="name" />
            {fieldErrors.name && <p className="mt-1 text-xs text-magenta">{fieldErrors.name[0]}</p>}
          </div>
          <div>
            <label htmlFor="cf-email" className="form-label">
              Email *
            </label>
            <input id="cf-email" name="email" type="email" required className={`field ${fieldErrors.email ? "field-error" : ""}`} autoComplete="email" />
            {fieldErrors.email && <p className="mt-1 text-xs text-magenta">{fieldErrors.email[0]}</p>}
          </div>
          <div>
            <label htmlFor="cf-phone" className="form-label">
              Phone
            </label>
            <input id="cf-phone" name="phone" type="tel" className="field" autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="cf-subject" className="form-label">
              Subject
            </label>
            <input id="cf-subject" name="subject" className="field" />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="cf-message" className="form-label">
            Message *
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            minLength={5}
            rows={5}
            className={`field resize-y ${fieldErrors.message ? "field-error" : ""}`}
          />
          {fieldErrors.message && <p className="mt-1 text-xs text-magenta">{fieldErrors.message[0]}</p>}
        </div>

        {/* Honeypot — hidden from humans */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="cf-hp">Leave this field empty</label>
          <input id="cf-hp" name="company_website" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" disabled={status === "loading"} className="btn btn-lime mt-6 w-full disabled:opacity-60 sm:w-auto">
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </FormShell>
  );
}

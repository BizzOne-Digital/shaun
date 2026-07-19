"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * Lightweight newsletter capture. Submissions are forwarded to the
 * contact endpoint so they arrive at the station mailbox — swap in a
 * real ESP integration later without touching the footer.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "newsletter",
          name: "Newsletter Signup",
          email,
          message: `Newsletter subscription request from ${email}`,
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-lime">
        <Check className="h-4 w-4" aria-hidden="true" /> You&apos;re on the list. Stay tuned!
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="field !py-3 text-sm"
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="Subscribe to the newsletter"
          className="btn btn-lime shrink-0 !px-4 !py-3 disabled:opacity-60"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-xs text-magenta">
          Something went wrong — please email us instead.
        </p>
      )}
    </form>
  );
}

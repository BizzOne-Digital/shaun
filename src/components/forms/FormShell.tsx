"use client";

import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Mail } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import type { FormStatus } from "./useFormSubmit";

/** Shared success / fallback / error presentation around any form. */
export function FormShell({
  status,
  errorMessage,
  successTitle,
  successText,
  onReset,
  children,
}: {
  status: FormStatus;
  errorMessage: string;
  successTitle: string;
  successText: string;
  onReset: () => void;
  children: ReactNode;
}) {
  if (status === "success" || status === "fallback") {
    return (
      <div className="card-surface rounded-2xl p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-lime" aria-hidden="true" />
        <h3 className="display mt-4 text-3xl text-white">{successTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">{successText}</p>
        {status === "fallback" && (
          <p className="mx-auto mt-3 max-w-md text-xs text-muted/80">
            Email delivery is still being configured — if you don&apos;t hear back soon, reach us
            directly at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-lime underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        )}
        <button type="button" onClick={onReset} className="btn btn-outline mt-6">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div>
      {children}
      {status === "error" && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3 text-sm text-white">
          <AlertTriangle className="h-4 w-4 shrink-0 text-magenta" aria-hidden="true" />
          <span>{errorMessage}</span>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-flex items-center gap-1.5 font-bold text-lime hover:underline"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email us instead
          </a>
        </div>
      )}
    </div>
  );
}

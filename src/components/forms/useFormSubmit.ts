"use client";

import { useState } from "react";

export type FormStatus = "idle" | "loading" | "success" | "error" | "fallback";

interface SubmitResult {
  status: FormStatus;
  errorMessage: string;
  fieldErrors: Record<string, string[]>;
  submit: (payload: Record<string, string>) => Promise<void>;
  reset: () => void;
}

/** Shared submission logic for all site forms (loading/success/error/fallback). */
export function useFormSubmit(): SubmitResult {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const submit = async (payload: Record<string, string>) => {
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus(data.fallback ? "fallback" : "success");
      } else {
        if (data.issues) setFieldErrors(data.issues);
        setErrorMessage(data.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error — please try again or email us directly.");
      setStatus("error");
    }
  };

  return {
    status,
    errorMessage,
    fieldErrors,
    submit,
    reset: () => setStatus("idle"),
  };
}

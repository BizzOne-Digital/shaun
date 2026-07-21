"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/siteConfig";

export type SpacialState = "loading" | "ready" | "error";

const SCRIPT_ID = "spacial-sam-widgets-v6";
let loadPromise: Promise<void> | null = null;

function isSamWidgetDefined(): boolean {
  return typeof customElements !== "undefined" && Boolean(customElements.get("sam-widget"));
}

function waitForSamWidget(timeoutMs = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isSamWidgetDefined()) {
      resolve();
      return;
    }

    let settled = false;
    const finish = (ok: boolean, err?: Error) => {
      if (settled) return;
      settled = true;
      window.clearInterval(poll);
      window.clearTimeout(timer);
      if (ok) resolve();
      else reject(err ?? new Error("Spacial widgets failed to define"));
    };

    const poll = window.setInterval(() => {
      if (isSamWidgetDefined()) finish(true);
    }, 50);

    const timer = window.setTimeout(() => {
      finish(false, new Error("Timed out waiting for sam-widget"));
    }, timeoutMs);

    // Prefer the platform API when available
    customElements
      .whenDefined("sam-widget")
      .then(() => finish(true))
      .catch(() => {
        /* poll / timeout handle failure */
      });
  });
}

function loadSpacialWidgets(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("SSR"));
  }
  if (isSamWidgetDefined()) return Promise.resolve();

  if (!loadPromise) {
    loadPromise = new Promise<void>((resolve, reject) => {
      const startWait = () => {
        waitForSamWidget()
          .then(resolve)
          .catch((err) => {
            loadPromise = null;
            reject(err);
          });
      };

      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (existing) {
        startWait();
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "module";
      script.src = siteConfig.spacial.scriptUrl;
      script.addEventListener("load", startWait);
      script.addEventListener("error", () => {
        loadPromise = null;
        console.error("[Spacial] Failed to load", siteConfig.spacial.scriptUrl);
        reject(new Error("Spacial script failed to load"));
      });
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}

/** Load Spacial v6 once; returns loading | ready | error. */
export function useSpacialReady(): SpacialState {
  const [state, setState] = useState<SpacialState>("loading");

  useEffect(() => {
    let cancelled = false;

    loadSpacialWidgets()
      .then(() => {
        if (!cancelled) setState("ready");
      })
      .catch((err) => {
        console.error("[Spacial]", err);
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function spacialThemeJson(): string {
  return JSON.stringify(siteConfig.spacial.theme);
}

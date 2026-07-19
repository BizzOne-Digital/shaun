"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { FacebookIcon, XIcon } from "@/components/ui/BrandIcons";

/** Social sharing row for articles. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // clipboard unavailable
    }
  };

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-muted">Share</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook (opens in a new tab)"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-violet hover:text-white"
      >
        <FacebookIcon className="h-4 w-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (opens in a new tab)"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-violet hover:text-white"
      >
        <XIcon className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy article link"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-lime hover:text-lime"
      >
        {copied ? <Check className="h-4 w-4 text-lime" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

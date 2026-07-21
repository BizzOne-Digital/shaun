"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/siteConfig";
import { spacialThemeJson, useSpacialReady } from "@/components/player/useSpacialReady";

type WidgetAttrs = Record<string, string>;

/**
 * Public Spacial v6 API is `<sam-widget type="player|playlist|chat" …>`.
 * Inner tags (sam-player, etc.) need parent data and are not meant to be mounted alone.
 */
function SpacialEmbed({
  type,
  attrs,
  minHeight = 160,
}: {
  type: "player" | "playlist" | "chat";
  attrs: WidgetAttrs;
  minHeight?: number;
}) {
  const state = useSpacialReady();
  const hostRef = useRef<HTMLDivElement>(null);
  const attrsKey = JSON.stringify(attrs);

  useEffect(() => {
    if (state !== "ready" || !hostRef.current) return;

    const host = hostRef.current;
    host.replaceChildren();

    const parsed = JSON.parse(attrsKey) as WidgetAttrs;
    const el = document.createElement("sam-widget");
    el.setAttribute("type", type);
    for (const [key, value] of Object.entries(parsed)) {
      el.setAttribute(key, value);
    }
    host.appendChild(el);
  }, [state, attrsKey, type]);

  if (state === "loading") {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-white/10 bg-black/30 px-4 py-10 text-center text-xs text-muted"
        style={{ minHeight }}
      >
        Loading Spacial widget…
      </div>
    );
  }

  if (state === "error") {
    return (
      <div
        className="rounded-lg border border-magenta/40 bg-magenta/10 px-4 py-6 text-center text-xs leading-relaxed text-muted"
        style={{ minHeight }}
      >
        <p className="font-bold text-white">Spacial widget could not load.</p>
        <p className="mt-2">Refresh the page, or confirm this domain is allowed in the Spacial dashboard.</p>
      </div>
    );
  }

  return <div ref={hostRef} className="spacial-embed w-full" style={{ minHeight }} />;
}

function baseAttrs(): WidgetAttrs {
  const { spacial } = siteConfig;
  return {
    "station-id": spacial.stationId,
    token: spacial.token,
    "playlist-id": spacial.playlistId,
    "refresh-interval": "30s",
    "station-refresh-interval": "default",
    "theme-border-radius": "square",
    "image-border-radius": "square",
    theme: spacialThemeJson(),
  };
}

/** Live player — proven Spacial v4 iframe (same as monsterousradio.com). */
export function SpacialPlayer({ className = "" }: { className?: string }) {
  const src = siteConfig.stream.legacyEmbedUrl;

  if (!src) {
    return (
      <div className={className}>
        <SpacialEmbed type="player" attrs={{ ...baseAttrs(), "anim-type": "bounce-in-right", easing: "ease-in-cubic" }} minHeight={180} />
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        src={src}
        title="Monsterous Radio live player"
        className="mx-auto block h-[160px] w-full max-w-[300px] border-0 bg-transparent"
        allow="autoplay; encrypted-media"
        referrerPolicy="no-referrer-when-downgrade"
        loading="eager"
      />
    </div>
  );
}

export function SpacialPlaylist({ className = "" }: { className?: string }) {
  const attrs: WidgetAttrs = {
    ...baseAttrs(),
    "anim-type": "focus-in-expand",
    easing: "ease-in-out-back",
    "show-buy-button": "when populated",
    "show-request-button": "false",
    "show-cover-art": "true",
    "playlist-limit": "10",
    "nav-controls": "all",
    playlists: siteConfig.spacial.playlistName,
  };

  return (
    <div className={className}>
      <SpacialEmbed type="playlist" attrs={attrs} minHeight={280} />
    </div>
  );
}

export function SpacialChat({ className = "" }: { className?: string }) {
  const attrs: WidgetAttrs = {
    ...baseAttrs(),
    "anim-type": "bounceInDown",
    easing: "ease-in-quint",
    "chat-font-size": "11",
    "max-chat-height": "239",
  };

  return (
    <div className={className}>
      <SpacialEmbed type="chat" attrs={attrs} minHeight={260} />
    </div>
  );
}

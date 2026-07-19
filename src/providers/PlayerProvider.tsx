"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { siteConfig } from "@/config/siteConfig";
import { getLiveState, type LiveState } from "@/lib/scheduleUtils";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "unavailable" | "error";

interface RecentTrack {
  title: string;
  time: string;
}

interface PlayerContextValue {
  status: PlayerStatus;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  expanded: boolean;
  live: LiveState | null;
  recent: RecentTrack[];
  hasStream: boolean;
  toggle: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setExpanded: (v: boolean) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStream = Boolean(siteConfig.stream.streamUrl);
  const [status, setStatus] = useState<PlayerStatus>(hasStream ? "idle" : "unavailable");
  const [volume, setVolumeState] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [live, setLive] = useState<LiveState | null>(null);
  const [recent] = useState<RecentTrack[]>([]);

  // Live schedule state — refreshed each minute on the client only
  useEffect(() => {
    const refresh = () => setLive(getLiveState());
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!hasStream) return;
    const audio = new Audio();
    audio.preload = "none";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onPlaying = () => setStatus("playing");
    const onPause = () => setStatus((s) => (s === "loading" ? s : "paused"));
    const onWaiting = () => setStatus("loading");
    const onError = () => setStatus("error");

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [hasStream]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !hasStream) return;
    if (status === "playing" || status === "loading") {
      audio.pause();
      // Drop the live buffer so resuming rejoins the real-time stream
      audio.src = "";
      setStatus("paused");
    } else {
      setStatus("loading");
      audio.src = siteConfig.stream.streamUrl;
      audio.play().catch(() => setStatus("error"));
    }
  }, [status, hasStream]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (v > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      status,
      isPlaying: status === "playing",
      volume,
      muted,
      expanded,
      live,
      recent,
      hasStream,
      toggle,
      setVolume,
      toggleMute,
      setExpanded,
    }),
    [status, volume, muted, expanded, live, recent, hasStream, toggle, setVolume, toggleMute]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

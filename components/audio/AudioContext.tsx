"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";

export type PlaylistItem = {
  slug: string;
  number: number;
  title: string;
  type: string;
};

export type AudioController = {
  locale: Locale;
  playlist: PlaylistItem[];
  index: number | null;
  activeSlug: string | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  playSlug: (slug: string) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  stop: () => void;
};

export const AudioCtx = createContext<AudioController | null>(null);

export function useAudio(): AudioController {
  const context = useContext(AudioCtx);
  if (!context) throw new Error("useAudio must be used within AudioPlayerProvider");
  return context;
}

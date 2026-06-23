"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { tracks, trackAudio } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { AudioCtx, type AudioController, type PlaylistItem } from "./AudioContext";
import MiniPlayer from "./MiniPlayer";

export function AudioPlayerProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const playlist = useMemo<PlaylistItem[]>(
    () =>
      tracks
        .filter((track) => trackAudio[track.slug])
        .map((track) => ({
          slug: track.slug,
          number: track.number,
          title: track.title[locale],
          type: track.type[locale],
        })),
    [locale],
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const activeSlug = index != null ? playlist[index]?.slug ?? null : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || index == null) return;

    const src = trackAudio[playlist[index].slug];
    if (!audio.currentSrc.endsWith(src)) {
      audio.src = src;
      setCurrentTime(0);
    }

    if (playing) {
      audio.play().catch((err: unknown) => {
        if (!(err instanceof DOMException) || err.name !== "AbortError") {
          setPlaying(false);
        }
      });
    } else {
      audio.pause();
    }
  }, [index, playing, playlist]);

  const playSlug = useCallback(
    (slug: string) => {
      const nextIndex = playlist.findIndex((track) => track.slug === slug);
      if (nextIndex < 0) return;

      if (nextIndex === index) {
        setPlaying((value) => !value);
      } else {
        setIndex(nextIndex);
        setPlaying(true);
      }
    },
    [playlist, index],
  );

  const toggle = useCallback(() => {
    if (index == null) {
      if (playlist.length) {
        setIndex(0);
        setPlaying(true);
      }
      return;
    }

    setPlaying((value) => !value);
  }, [index, playlist.length]);

  const next = useCallback(() => {
    setIndex((value) =>
      value != null && value < playlist.length - 1 ? value + 1 : value,
    );
    setPlaying(true);
  }, [playlist.length]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    setIndex((value) => (value != null && value > 0 ? value - 1 : value));
    setPlaying(true);
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    setPlaying(false);
    setIndex(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const value: AudioController = {
    locale,
    playlist,
    index,
    activeSlug,
    playing,
    currentTime,
    duration,
    playSlug,
    toggle,
    next,
    prev,
    seek,
    stop,
  };

  return (
    <AudioCtx.Provider value={value}>
      {children}
      {index != null && <div aria-hidden className="h-20 md:h-[4.5rem]" />}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => {
          if (index != null && index < playlist.length - 1) {
            setIndex(index + 1);
            setPlaying(true);
          } else {
            setPlaying(false);
          }
        }}
      />
      <MiniPlayer />
    </AudioCtx.Provider>
  );
}

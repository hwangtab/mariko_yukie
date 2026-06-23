"use client";

import Image from "next/image";
import { images } from "@/lib/content";
import { tri } from "@/lib/i18n";
import { useAudio } from "./AudioContext";
import { IconClose, IconNext, IconPause, IconPlay, IconPrev } from "./icons";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export default function MiniPlayer() {
  const {
    locale,
    playlist,
    index,
    playing,
    currentTime,
    duration,
    toggle,
    next,
    prev,
    seek,
    stop,
  } = useAudio();

  if (index == null) return null;

  const current = playlist[index];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-coral bg-night/95 text-cream backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2 md:gap-4 md:px-6 md:py-2.5">
        <Image
          src={images.cover}
          alt=""
          width={48}
          height={48}
          className="hidden h-11 w-11 shrink-0 rounded-lg border border-cream/20 object-cover sm:block"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="pixel shrink-0 text-[11px] text-yellow">
              {String(current.number).padStart(2, "0")}
            </span>
            <span className="truncate font-heading text-sm text-cream md:text-base">
              {current.title}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="pixel hidden w-9 shrink-0 text-right text-[10px] text-cream/60 sm:block">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label={tri(locale, "재생 위치", "再生位置", "Seek")}
              className="player-range h-1.5 flex-1"
              style={{ ["--pct" as string]: `${progress}%` }}
            />
            <span className="pixel hidden w-9 shrink-0 text-[10px] text-cream/60 sm:block">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 md:gap-2">
          <button
            onClick={prev}
            aria-label={tri(locale, "이전 곡", "前の曲", "Previous")}
            className="rounded-full p-2 text-cream/80 transition hover:text-yellow disabled:opacity-30"
            disabled={index <= 0}
          >
            <IconPrev />
          </button>
          <button
            onClick={toggle}
            aria-label={
              playing
                ? tri(locale, "일시정지", "一時停止", "Pause")
                : tri(locale, "재생", "再生", "Play")
            }
            className="grid h-10 w-10 place-items-center rounded-full bg-coral text-cream transition hover:bg-coral-deep"
          >
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          <button
            onClick={next}
            aria-label={tri(locale, "다음 곡", "次の曲", "Next")}
            className="rounded-full p-2 text-cream/80 transition hover:text-yellow disabled:opacity-30"
            disabled={index >= playlist.length - 1}
          >
            <IconNext />
          </button>
          <button
            onClick={stop}
            aria-label={tri(locale, "닫기", "閉じる", "Close")}
            className="ml-0.5 rounded-full p-1.5 text-cream/50 transition hover:text-cream md:ml-1"
          >
            <IconClose />
          </button>
        </div>
      </div>
    </div>
  );
}

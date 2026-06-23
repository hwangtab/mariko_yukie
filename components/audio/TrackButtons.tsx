"use client";

import { useAudio } from "./AudioContext";
import { IconPause, IconPlay } from "./icons";

export function TrackPlayButton({ slug }: { slug: string }) {
  const { activeSlug, playing, playSlug } = useAudio();
  const isActive = activeSlug === slug;
  const isPlaying = isActive && playing;

  return (
    <button
      onClick={() => playSlug(slug)}
      aria-label={isPlaying ? "일시정지" : "재생"}
      aria-pressed={isPlaying}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition ${
        isActive
          ? "border-coral bg-coral text-cream"
          : "border-navy bg-cream text-navy hover:bg-navy hover:text-cream"
      }`}
    >
      {isPlaying ? <IconPause small /> : <IconPlay small />}
    </button>
  );
}

export function PlayThisTrack({
  slug,
  label,
  labelPause,
}: {
  slug: string;
  label: string;
  labelPause: string;
}) {
  const { activeSlug, playing, playSlug } = useAudio();
  const isPlaying = activeSlug === slug && playing;

  return (
    <button
      onClick={() => playSlug(slug)}
      className="sticker sticker-coral inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 font-display text-cream transition hover:-translate-y-1"
    >
      {isPlaying ? <IconPause small /> : <IconPlay small />}
      {isPlaying ? labelPause : label}
    </button>
  );
}

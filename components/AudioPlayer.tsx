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
import Image from "next/image";
import { tracks, trackAudio, images } from "@/lib/content";
import { tri, type Locale } from "@/lib/i18n";

type PlItem = { slug: string; number: number; title: string; type: string };

type Ctx = {
  locale: Locale;
  playlist: PlItem[];
  index: number | null;
  activeSlug: string | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  playSlug: (slug: string) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  stop: () => void;
};

const AudioCtx = createContext<Ctx | null>(null);

export function useAudio(): Ctx {
  const c = useContext(AudioCtx);
  if (!c) throw new Error("useAudio must be used within AudioPlayerProvider");
  return c;
}

function fmt(s: number): string {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function AudioPlayerProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const playlist = useMemo<PlItem[]>(
    () =>
      tracks
        .filter((t) => trackAudio[t.slug])
        .map((t) => ({
          slug: t.slug,
          number: t.number,
          title: t.title[locale],
          type: t.type[locale],
        })),
    [locale],
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const activeSlug = index != null ? playlist[index]?.slug ?? null : null;

  // 트랙/재생상태 변화에 따라 실제 <audio> 제어
  useEffect(() => {
    const a = audioRef.current;
    if (!a || index == null) return;
    const src = trackAudio[playlist[index].slug];
    if (!a.currentSrc.endsWith(src)) {
      a.src = src;
      a.load();
      setCurrentTime(0);
    }
    if (playing) {
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, [index, playing, playlist]);

  const playSlug = useCallback(
    (slug: string) => {
      const i = playlist.findIndex((p) => p.slug === slug);
      if (i < 0) return;
      if (i === index) {
        setPlaying((p) => !p);
      } else {
        setIndex(i);
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
    setPlaying((p) => !p);
  }, [index, playlist.length]);

  const next = useCallback(() => {
    setIndex((i) => (i != null && i < playlist.length - 1 ? i + 1 : i));
    setPlaying(true);
  }, [playlist.length]);

  const prev = useCallback(() => {
    const a = audioRef.current;
    // 3초 이상 재생됐으면 처음으로, 아니면 이전 곡
    if (a && a.currentTime > 3) {
      a.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    setIndex((i) => (i != null && i > 0 ? i - 1 : i));
    setPlaying(true);
  }, []);

  const seek = useCallback((t: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = t;
    setCurrentTime(t);
  }, []);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) a.pause();
    setPlaying(false);
    setIndex(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const value: Ctx = {
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
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
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

function MiniPlayer() {
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
  const cur = playlist[index];
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

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
              {String(cur.number).padStart(2, "0")}
            </span>
            <span className="truncate font-heading text-sm text-cream md:text-base">
              {cur.title}
            </span>
          </div>
          {/* 진행 바 */}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="pixel hidden w-9 shrink-0 text-right text-[10px] text-cream/60 sm:block">
              {fmt(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={tri(locale, "재생 위치", "再生位置", "Seek")}
              className="player-range h-1.5 flex-1"
              style={{ ["--pct" as string]: `${pct}%` }}
            />
            <span className="pixel hidden w-9 shrink-0 text-[10px] text-cream/60 sm:block">
              {fmt(duration)}
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

/* ── 트랙리스트 / 상세 페이지에서 쓰는 재생 버튼 ── */
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

/* ── 아이콘 (인라인 SVG) ── */
function IconPlay({ small }: { small?: boolean }) {
  const s = small ? 14 : 18;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IconPause({ small }: { small?: boolean }) {
  const s = small ? 14 : 18;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function IconPrev() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 6h2v12H7zM20 6v12L9 12z" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15 6h2v12h-2zM4 6l11 6L4 18z" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

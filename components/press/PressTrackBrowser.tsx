"use client";

import { useState } from "react";
import { useAudio } from "@/components/audio/AudioContext";
import { TrackPlayButton } from "@/components/audio/TrackButtons";
import { ui, type Locale } from "@/lib/i18n";

export type PressTrackItem = {
  slug: string;
  number: number;
  title: string;
  type: string;
  isTitle?: boolean;
  lyrics: string[][] | null;
};

/**
 * 처음 펼쳐 보일 트랙.
 *
 * 1번은 가사 없는 인트로 소곡이라, 순서대로 고르면 기자가 페이지를 연 순간
 * 빈 가사 패널을 만난다. 타이틀곡을 우선하되 없으면 가사가 있는 첫 곡으로 간다.
 */
function initialSlug(items: PressTrackItem[]): string {
  const titleTrack = items.find((item) => item.isTitle && item.lyrics);
  const withLyrics = items.find((item) => item.lyrics);
  return (titleTrack ?? withLyrics ?? items[0])?.slug ?? "";
}

/**
 * 기자가 페이지를 떠나지 않고 전곡을 듣고 가사까지 읽게 하는 것이 이 컴포넌트의 목적이다.
 * 재생 상태는 레이아웃의 AudioPlayerProvider가 이미 들고 있으므로 새로 만들지 않고
 * useAudio()로 얹는다. 여기서 더하는 것은 선택된 트랙의 가사를 옆에 띄우는 일뿐이다.
 */
export default function PressTrackBrowser({
  locale,
  items,
}: {
  locale: Locale;
  items: PressTrackItem[];
}) {
  const { activeSlug, playSlug } = useAudio();
  const [selected, setSelected] = useState<string>(() => initialSlug(items));

  // 재생 중인 트랙이 있으면 그쪽 가사를 보여준다. 없으면 마지막으로 고른 트랙.
  const shownSlug = activeSlug ?? selected;
  const shown = items.find((item) => item.slug === shownSlug) ?? items[0];

  if (!shown) return null;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <ol className="overflow-hidden rounded-card border-2 border-navy">
        {items.map((item, i) => {
          const isShown = item.slug === shownSlug;
          return (
            <li
              key={item.slug}
              className={
                isShown
                  ? "bg-yellow/30"
                  : i % 2 === 0
                    ? "bg-cream"
                    : "bg-cream-deep/60"
              }
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <TrackPlayButton slug={item.slug} />
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item.slug);
                    playSlug(item.slug);
                  }}
                  className="flex flex-1 items-baseline gap-3 text-left"
                >
                  <span className="pixel w-8 shrink-0 text-sm text-coral-deep">
                    {String(item.number).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-heading text-lg text-navy">{item.title}</span>
                  <span className="hidden text-xs text-navy/50 sm:inline">{item.type}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="rounded-card border-2 border-navy bg-cream p-6 md:sticky md:top-24 md:self-start">
        <p className="pixel text-xs uppercase tracking-[0.2em] text-coral-deep">
          {String(shown.number).padStart(2, "0")} · {shown.title}
        </p>
        {shown.lyrics ? (
          <div className="mt-5 space-y-5">
            {shown.lyrics.map((stanza, si) => (
              <p key={si} className="whitespace-pre-line leading-relaxed text-navy">
                {stanza.join("\n")}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-navy/60">{ui.press.lyricsPending[locale]}</p>
        )}
      </div>
    </div>
  );
}

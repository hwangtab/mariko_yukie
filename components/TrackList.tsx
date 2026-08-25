"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { tri, ui, type Locale } from "@/lib/i18n";
import { tracks } from "@/lib/content";
import { useAudio, TrackPlayButton } from "@/components/AudioPlayer";

/**
 * 앨범 트랙리스트.
 *
 * `lyrics`를 받으면 각 행이 그 자리에서 가사를 펼치는 아코디언이 된다. 가사는
 * node:fs로 읽으므로 클라이언트에서 직접 못 가져온다 — 서버 페이지가 넘겨준다.
 * 넘기지 않으면(홈) 지금까지처럼 곡 상세로 가는 링크 목록으로 남는다.
 */
export default function TrackList({
  locale,
  lyrics,
}: {
  locale: Locale;
  lyrics?: Record<string, string[][]>;
}) {
  const { activeSlug } = useAudio();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // 재생을 시작하면 그 곡의 가사로 따라간다. 가사가 없는 곡(인트로 소곡)이면
  // 아래 렌더에서 걸러지므로 앞서 열려 있던 패널만 닫힌다.
  useEffect(() => {
    if (activeSlug) setOpenSlug(activeSlug);
  }, [activeSlug]);

  return (
    <ol className="overflow-hidden rounded-card border-2 border-navy">
      {tracks.map((tk, i) => {
        const isActive = activeSlug === tk.slug;
        const stanzas = lyrics?.[tk.slug];
        const isOpen = Boolean(stanzas) && openSlug === tk.slug;
        const panelId = `tracklist-lyrics-${tk.slug}`;

        const rowBody = (
          <>
            <span className="pixel w-6 shrink-0 text-sm text-coral-deep">
              {String(tk.number).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <span
                className={`font-heading text-lg group-hover:text-coral ${
                  isActive ? "text-coral" : "text-navy"
                }`}
              >
                {tk.title[locale]}
              </span>
              <span className="ml-3 hidden text-sm text-navy/50 sm:inline">
                {tk.type[locale]}
              </span>
            </div>
            <span className="flex shrink-0 items-center gap-1.5">
              {tk.isTitle && (
                <span className="pixel rounded-full bg-coral px-2 py-0.5 text-[10px] text-cream">
                  {ui.common.titleTrack[locale]}
                </span>
              )}
              {tk.hasMV && (
                <span className="pixel rounded-full border border-blue-deep px-2 py-0.5 text-[10px] text-blue-deep">
                  {ui.common.mv[locale]}
                </span>
              )}
              {tk.isBonus && (
                <span className="pixel rounded-full border border-teal px-2 py-0.5 text-[10px] text-teal">
                  {ui.common.bonus[locale]}
                </span>
              )}
              {stanzas ? (
                <span
                  aria-hidden
                  className={`text-navy/40 transition group-hover:text-coral ${
                    isOpen ? "rotate-180 text-coral" : ""
                  }`}
                >
                  ▾
                </span>
              ) : (
                <span className="text-navy/40 transition group-hover:translate-x-1 group-hover:text-coral">
                  →
                </span>
              )}
            </span>
          </>
        );

        return (
          <li
            key={tk.slug}
            className={
              isActive || isOpen
                ? "bg-yellow/30"
                : i % 2 === 0
                  ? "bg-cream"
                  : "bg-cream-deep/60"
            }
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <TrackPlayButton slug={tk.slug} />
              {stanzas ? (
                <button
                  type="button"
                  onClick={() => setOpenSlug(isOpen ? null : tk.slug)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group flex min-w-0 flex-1 items-baseline gap-3 text-left"
                >
                  {rowBody}
                </button>
              ) : (
                <Link
                  href={`/${locale}/album/${tk.slug}`}
                  className="group flex min-w-0 flex-1 items-baseline gap-3"
                >
                  {rowBody}
                </Link>
              )}
            </div>

            {isOpen && stanzas && (
              <div
                id={panelId}
                className="lyrics-open border-t-2 border-navy/12 px-4 pb-5 pt-4 sm:pl-16 sm:pr-8"
              >
                <div className="space-y-4">
                  {stanzas.map((stanza, si) => (
                    <p
                      key={si}
                      className="whitespace-pre-line leading-relaxed text-navy/90"
                    >
                      {stanza.join("\n")}
                    </p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <Link
                    href={`/${locale}/album/${tk.slug}`}
                    className="link-underline font-heading text-coral-deep"
                  >
                    {tri(locale, "곡 이야기", "曲の話", "Track note")} →
                  </Link>
                  <Link
                    href={`/${locale}/lyrics/${tk.slug}`}
                    className="link-underline font-heading text-navy/55"
                  >
                    {tri(locale, "가사 페이지", "歌詞ページ", "Lyrics page")} →
                  </Link>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

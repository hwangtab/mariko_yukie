"use client";

import Link from "next/link";
import { ui, type Locale } from "@/lib/i18n";
import { tracks } from "@/lib/content";
import { useAudio, TrackPlayButton } from "@/components/AudioPlayer";

export default function TrackList({ locale }: { locale: Locale }) {
  const { activeSlug } = useAudio();
  return (
    <ol className="overflow-hidden rounded-card border-2 border-navy">
      {tracks.map((tk, i) => {
        const isActive = activeSlug === tk.slug;
        return (
          <li
            key={tk.slug}
            className={
              isActive
                ? "bg-yellow/30"
                : i % 2 === 0
                  ? "bg-cream"
                  : "bg-cream-deep/60"
            }
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <TrackPlayButton slug={tk.slug} />
              <Link
                href={`/${locale}/album/${tk.slug}`}
                className="group flex min-w-0 flex-1 items-baseline gap-3"
              >
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
                  <span className="text-navy/40 transition group-hover:translate-x-1 group-hover:text-coral">
                    →
                  </span>
                </span>
              </Link>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

import Link from "next/link";
import { ui, type Locale } from "@/lib/i18n";
import { links } from "@/lib/content";
import { Star } from "./ui";

// 상황별 CTA — 펀딩 기간엔 텀블벅, 미확정 시 "곧 공개"
export default function CTABlock({ locale }: { locale: Locale }) {
  const hasTumblbug = links.tumblbug.length > 0;
  const hasStreaming = Object.values(links.streaming).some(Boolean);

  return (
    <section className="night relative overflow-hidden">
      <div aria-hidden className="halftone-light pointer-events-none absolute inset-0 opacity-20" />
      <Star size={28} className="twinkle absolute left-[12%] top-12 text-yellow" />
      <Star size={18} className="twinkle-2 absolute right-[18%] top-20 text-pink" />
      <Star size={22} className="twinkle absolute bottom-16 right-[12%] text-blue" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 text-center md:px-8">
        <p className="pixel text-xs uppercase tracking-[0.2em] text-yellow">
          2026 · Namsan Tower
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl text-balance font-display text-3xl leading-tight outline-navy-thin md:text-5xl">
          {locale === "ja"
            ? "このアルバムを世に出す力は、あなたの応援です。"
            : "이 음반을 세상에 내보내는 힘은 당신의 후원입니다."}
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {hasTumblbug ? (
            <a
              href={links.tumblbug}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker sticker-coral rounded-full bg-coral px-8 py-3.5 font-display text-base text-cream transition hover:-translate-y-1 hover:bg-coral-deep"
            >
              {ui.cta.support[locale]} ↗
            </a>
          ) : (
            <span className="rounded-full border-2 border-yellow bg-yellow/10 px-8 py-3.5 font-display text-base text-yellow">
              {ui.cta.support[locale]} · {ui.cta.soon[locale]}
            </span>
          )}

          <Link
            href={hasStreaming ? `/${locale}/album` : `/${locale}/video`}
            className="link-underline font-display text-base text-cream/85"
          >
            {hasStreaming ? ui.cta.listen[locale] : ui.cta.watchMV[locale]} →
          </Link>
        </div>
      </div>
    </section>
  );
}

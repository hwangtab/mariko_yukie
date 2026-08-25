import Link from "next/link";
import { tri, ui, type Locale } from "@/lib/i18n";
import { campaignPhase, links } from "@/lib/content";
import { Star } from "./ui";

// 상황별 CTA — 펀딩 기간엔 텀블벅, 그 밖에는 발매 예고와 공연으로 보낸다.
// hasTumblbug 분기를 남겨두는 이유: campaignPhase는 4개 국면을 오가는 스위치이고,
// 나중에 다른 펀딩을 열 수 있다. 죽은 코드가 아니라 스위치의 한쪽 날개다.
export default function CTABlock({ locale }: { locale: Locale }) {
  const isFunding = campaignPhase === "funding";
  const hasTumblbug = isFunding && links.tumblbug.length > 0;
  const hasStreaming = Object.values(links.streaming).some(Boolean);

  return (
    <section className="night relative overflow-hidden">
      <div aria-hidden className="halftone-light pointer-events-none absolute inset-0 opacity-20" />
      <Star size={28} className="twinkle absolute left-[12%] top-12 text-yellow" />
      <Star size={18} className="twinkle-2 absolute right-[18%] top-20 text-pink" />
      <Star size={22} className="twinkle absolute bottom-16 right-[12%] text-blue" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 text-center md:px-8">
        <p className="pixel text-xs uppercase tracking-[0.2em] text-yellow">
          2026 · Namsan Tower Lights
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl text-balance font-display text-3xl leading-tight outline-navy-thin md:text-5xl">
          {hasTumblbug
            ? tri(
                locale,
                "이 음반을 세상에 내보내는 힘은 당신의 후원입니다.",
                "このアルバムを世に出す力は、あなたの応援です。",
                "The power to bring this album into the world is your support.",
              )
            : tri(
                locale,
                "2026년 9월 4일, 《남산타워》가 나옵니다.",
                "2026年9月4日、『南山タワー』が届きます。",
                "September 4, 2026 — Namsan Tower Lights arrives.",
              )}
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
            <Link
              href={`/${locale}/album`}
              className="sticker sticker-coral rounded-full bg-coral px-8 py-3.5 font-display text-base text-cream transition hover:-translate-y-1 hover:bg-coral-deep"
            >
              {hasStreaming ? ui.cta.listen[locale] : ui.nav.album[locale]} →
            </Link>
          )}

          <Link
            href={`/${locale}/live`}
            className="rounded-full border-2 border-cream/80 px-8 py-3.5 font-display text-base text-cream transition hover:-translate-y-1 hover:bg-cream hover:text-night"
          >
            {ui.nav.live[locale]} →
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, ui, type Locale } from "@/lib/i18n";
import { album, images } from "@/lib/content";
import { SectionLabel, Stamp, Star, WaveDivider } from "@/components/ui";
import Reveal from "@/components/Reveal";
import TrackList from "@/components/TrackList";
import CTABlock from "@/components/CTABlock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return { title: album.title[loc], description: album.concept[loc] };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <>
      <section className="night relative overflow-hidden">
        <div aria-hidden className="groovy-soft groovy-spin pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full opacity-25" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-28 md:grid-cols-2 md:px-8 md:pb-24 md:pt-32">
          <Reveal>
            <div className="relative mx-auto max-w-sm">
              <Image
                src={images.cover}
                alt={`${album.title[locale]} ${album.titleRoman}`}
                width={1280}
                height={1280}
                priority
                sizes="(max-width: 768px) 80vw, 420px"
                className="sticker w-full rounded-card"
              />
              <Star size={36} className="twinkle absolute -right-5 -top-5 text-yellow" />
              <Star size={22} className="twinkle-2 absolute -bottom-3 -left-3 text-pink" />
            </div>
          </Reveal>
          <div>
            <SectionLabel tone="cream">Album · 2026</SectionLabel>
            <h1 className="mt-4 font-display text-6xl text-yellow text-shadow-pop md:text-7xl">
              {album.title[locale]}
            </h1>
            <p className="mt-2 font-display text-xl text-cream">{album.titleRoman}</p>
            <div className="mt-5">
              <Stamp tone="navy">
                <span className="text-cream">{album.releaseLabel[locale]}</span>
              </Stamp>
            </div>
            <p className="mt-6 max-w-md text-balance text-lg leading-relaxed text-cream/85">
              {album.concept[locale]}
            </p>
          </div>
        </div>
        {/* 하단을 평평한 night로 페이드 → 물결 디바이더와 seam 제거 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-night"
        />
      </section>

      <WaveDivider from="var(--color-night)" to="var(--color-cream)" />

      {/* 앨범이 말하는 것 */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <SectionLabel>{locale === "ja" ? "このアルバムが語ること" : "앨범이 말하는 것"}</SectionLabel>
        <div className="mt-6 space-y-5">
          {album.says[locale].map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className="text-lg leading-loose text-navy/85">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 포지셔닝 */}
      <section className="border-y-2 border-navy bg-cream-deep/40">
        <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
          <SectionLabel tone="coral">
            {locale === "ja" ? "このアルバムの独自性" : "이 음반의 독창성"}
          </SectionLabel>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {album.positioning.map((p, i) => (
              <Reveal key={i} delay={i * 70}>
                <li
                  className={`flex h-full gap-4 rounded-card border-2 border-navy p-5 ${
                    ["bg-coral/10", "bg-blue/10", "bg-pink/10", "bg-yellow/15", "bg-teal/10"][i % 5]
                  }`}
                >
                  <span className="font-display text-3xl text-coral outline-navy-thin">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-heading text-lg leading-snug text-navy">{p[locale]}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 트랙리스트 */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <div className="flex items-center gap-3">
          <SectionLabel tone="coral">{ui.common.tracklist[locale]}</SectionLabel>
        </div>
        <h2 className="mt-4 font-display text-3xl text-navy">
          {locale === "ja" ? "全15トラック" : "총 15트랙"}
        </h2>
        <p className="mt-1 text-sm text-navy/60">
          {locale === "ja" ? "韓国語10 + 日本語5" : "한국어 10 + 일본어 5"}
        </p>
        <div className="mt-7">
          <TrackList locale={locale} />
        </div>
      </section>

      {/* 음반 사양 */}
      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8">
        <SectionLabel>{ui.common.spec[locale]}</SectionLabel>
        <dl className="mt-6 divide-y divide-navy/15 overflow-hidden rounded-card border-2 border-navy">
          {album.spec.map((row, i) => (
            <div key={i} className="flex justify-between gap-4 px-5 py-3.5">
              <dt className="text-sm text-navy/60">{row.label[locale]}</dt>
              <dd className="text-right font-heading text-navy">{row.value[locale]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CTABlock locale={locale} />
    </>
  );
}

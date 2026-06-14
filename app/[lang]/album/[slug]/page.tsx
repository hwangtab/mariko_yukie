import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, tri, ui, type Locale } from "@/lib/i18n";
import { tracks, getTrack, album, trackImages } from "@/lib/content";
import { Stamp, Star } from "@/components/ui";
import Reveal from "@/components/Reveal";
import CTABlock from "@/components/CTABlock";
import { PlayThisTrack } from "@/components/AudioPlayer";

export function generateStaticParams() {
  return tracks.flatMap((t) =>
    locales.map((lang) => ({ lang, slug: t.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const tk = getTrack(slug);
  if (!tk) return {};
  // 트랙 제목이 앨범 제목을 포함하면 앨범명 반복 생략 (중복 방지)
  const t = tk.title[loc];
  const title = t.includes(album.title[loc]) ? t : `${t} — ${album.title[loc]}`;
  return {
    title,
    description: tk.pull?.[loc] ?? tk.body[loc][0],
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const tk = getTrack(slug);
  if (!tk) notFound();

  const idx = tracks.findIndex((t) => t.slug === slug);
  const prev = tracks[idx - 1];
  const next = tracks[idx + 1];
  const heroImg = trackImages[tk.slug];

  return (
    <>
      <section className="night relative overflow-hidden">
        {heroImg && (
          <>
            <Image src={heroImg} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/82 to-night/55" />
          </>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute right-2 top-0 select-none font-display text-[38vw] leading-none text-cream/[0.06]"
        >
          {String(tk.number).padStart(2, "0")}
        </div>
        <div className="relative mx-auto max-w-3xl px-5 py-20 md:px-8">
          <Link href={`/${locale}/album`} className="link-underline text-sm text-cream/70">
            {ui.common.backToAlbum[locale]}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="pixel text-lg text-yellow">
              TRACK {String(tk.number).padStart(2, "0")}
            </span>
            {tk.isTitle && (
              <Stamp tone="navy">
                <span className="text-cream">{ui.common.titleTrack[locale]}</span>
              </Stamp>
            )}
            {tk.isBonus && (
              <Stamp tone="navy">
                <span className="text-cream">{ui.common.bonus[locale]}</span>
              </Stamp>
            )}
          </div>
          <h1 className="mt-4 font-display text-5xl leading-tight text-yellow text-shadow-pop md:text-6xl">
            {tk.title[locale]}
          </h1>
          <p className="mt-3 text-cream/80">{tk.type[locale]}</p>
          {tk.pull && (
            <p className="mt-6 font-hand text-2xl text-cream">{tk.pull[locale]}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-16 md:px-8">
        <div className="space-y-5">
          {tk.body[locale].map((p, i) => (
            <Reveal key={i} delay={i * 70}>
              <p className="text-lg leading-loose text-navy/85">{p}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <PlayThisTrack
            slug={tk.slug}
            label={tri(locale, "이 곡 듣기", "この曲を聴く", "Play this track")}
            labelPause={tri(locale, "일시정지", "一時停止", "Pause")}
          />
          {tk.hasMV && (
            <Link
              href={`/${locale}/video`}
              className="sticker sticker-coral rounded-full bg-coral px-5 py-2.5 font-display text-cream transition hover:-translate-y-1"
            >
              {ui.cta.watchMV[locale]} →
            </Link>
          )}
          <Link
            href={`/${locale}/lyrics/${tk.slug}`}
            className="rounded-full border-2 border-navy px-5 py-2.5 font-display text-navy transition hover:bg-navy hover:text-cream"
          >
            {ui.common.lyricsOf[locale]} →
          </Link>
        </div>
      </section>

      {/* 이전/다음 */}
      <section className="mx-auto max-w-2xl px-5 pb-16 md:px-8">
        <div className="flex justify-between gap-4 border-t-2 border-navy/15 pt-6">
          {prev ? (
            <Link href={`/${locale}/album/${prev.slug}`} className="group max-w-[45%]">
              <span className="pixel text-xs text-navy/50">
                ← {String(prev.number).padStart(2, "0")}
              </span>
              <p className="font-heading text-navy group-hover:text-coral">{prev.title[locale]}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/${locale}/album/${next.slug}`}
              className="group max-w-[45%] text-right"
            >
              <span className="pixel text-xs text-navy/50">
                {String(next.number).padStart(2, "0")} →
              </span>
              <p className="font-heading text-navy group-hover:text-coral">{next.title[locale]}</p>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>

      <CTABlock locale={locale} />
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, tri, ui, type Locale } from "@/lib/i18n";
import { album, images, links, tracks, fullAlbumVideoId } from "@/lib/content";
import { lyrics } from "@/lib/lyrics";
import { buildPageMetadata } from "@/lib/metadata";
import { SectionLabel, Star } from "@/components/ui";
import PressTrackBrowser, { type PressTrackItem } from "@/components/press/PressTrackBrowser";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return buildPageMetadata({
    locale: loc,
    path: "/press",
    title: `${ui.press.heading[loc]} — ${album.title[loc]}`,
    description: ui.press.intro[loc],
  });
}

export default async function PressPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const items: PressTrackItem[] = tracks.map((track) => ({
    slug: track.slug,
    number: track.number,
    title: track.title[locale],
    type: track.type[locale],
    isTitle: track.isTitle,
    lyrics: lyrics[track.slug] ?? null,
  }));

  return (
    <>
      <section className="night relative overflow-hidden">
        <Star size={22} className="twinkle absolute right-[14%] top-14 text-yellow" />
        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-24 md:px-8">
          <SectionLabel tone="cream">Press</SectionLabel>
          <h1 className="mt-5 font-display text-5xl text-yellow text-shadow-pop md:text-6xl">
            {ui.press.heading[locale]}
          </h1>
          <p className="mt-4 max-w-2xl text-cream/80">{ui.press.intro[locale]}</p>
          <p className="mt-2 font-heading text-lg text-cream">{album.releaseLabel[locale]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        <dl className="grid gap-4 sm:grid-cols-2">
          {album.spec.map((row) => (
            <div key={row.label.en} className="rounded-card border-2 border-navy bg-cream px-4 py-3">
              <dt className="pixel text-[10px] uppercase tracking-[0.15em] text-coral-deep">
                {row.label[locale]}
              </dt>
              <dd className="mt-1 font-heading text-navy">{row.value[locale]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-14 md:px-8">
        <p className="mb-5 text-navy/70">{ui.press.selectTrack[locale]}</p>
        <PressTrackBrowser locale={locale} items={items} />
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24 md:px-8">
        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <Image
            src={images.cover}
            alt={`${album.title[locale]} ${album.titleRoman}`}
            width={640}
            height={640}
            sizes="220px"
            className="sticker w-full rounded-card"
          />
          <ul className="space-y-3 self-center">
            <li>
              <a
                href="/press/namsan-tower-press-kit.zip"
                download
                className="font-heading text-lg text-coral-deep underline decoration-2 underline-offset-4 hover:text-coral"
              >
                {ui.press.audioZip[locale]} ↓
              </a>
              <p className="mt-1 text-sm text-navy/60">{ui.press.audioHiRes[locale]}</p>
            </li>
            <li>
              <a
                href="/press/albumart-4000.png"
                download
                className="font-heading text-lg text-coral-deep underline decoration-2 underline-offset-4 hover:text-coral"
              >
                {ui.press.artwork[locale]} ↓
              </a>
            </li>
            <li>
              <a
                href={`https://www.youtube.com/watch?v=${links.musicVideoYoutubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-lg text-coral-deep underline decoration-2 underline-offset-4 hover:text-coral"
              >
                {ui.press.watchMV[locale]} ↗
              </a>
            </li>
            <li>
              <a
                href={`https://www.youtube.com/watch?v=${fullAlbumVideoId(locale)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-lg text-coral-deep underline decoration-2 underline-offset-4 hover:text-coral"
              >
                {ui.press.watchFullAlbum[locale]} ↗
              </a>
            </li>
            <li>
              <a
                href={`mailto:${links.contactEmail}`}
                className="font-heading text-lg text-coral-deep underline decoration-2 underline-offset-4 hover:text-coral"
              >
                {ui.press.contact[locale]}: {links.contactEmail}
              </a>
            </li>
            <li className="pt-2 text-sm text-navy/60">
              {tri(
                locale,
                "수록곡 해설과 전체 가사는 앨범·가사 페이지에서 보실 수 있습니다.",
                "収録曲の解説と全歌詞は、アルバム・歌詞ページでご覧いただけます。",
                "Track notes and full lyrics are on the album and lyrics pages.",
              )}
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

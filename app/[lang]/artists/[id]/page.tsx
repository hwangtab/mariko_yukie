import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, ui, type Locale } from "@/lib/i18n";
import { artists, getArtist } from "@/lib/content";
import { SectionLabel, Star } from "@/components/ui";
import Reveal from "@/components/Reveal";
import RetroImage from "@/components/RetroImage";
import CTABlock from "@/components/CTABlock";

export function generateStaticParams() {
  return artists.flatMap((a) =>
    (["ko", "ja"] as const).map((lang) => ({ lang, id: a.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const a = getArtist(id);
  if (!a) return {};
  return { title: a.name[loc], description: a.lead[loc] };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const a = getArtist(id);
  if (!a) notFound();
  const rotations = [-2, 2, -1.5, 1.5];

  return (
    <>
      {/* HERO: 사진 + 이름 */}
      <section className="night relative overflow-hidden">
        <Image src={a.photo} alt="" fill sizes="100vw" className="object-cover object-top opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/55" />
        <Star size={26} className="twinkle absolute right-[12%] top-20 text-yellow" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 md:px-8 md:py-28">
          <Link href={`/${locale}/artists`} className="link-underline text-sm text-cream/70">
            ← {ui.nav.artists[locale]}
          </Link>
          <p className="pixel mt-8 text-sm text-yellow">{a.roman}</p>
          <h1 className="mt-3 font-display text-6xl text-yellow text-shadow-pop md:text-8xl">
            {a.name[locale]}
          </h1>
          <p className="mt-3 font-hand text-3xl text-cream">{a.tagline[locale]}</p>
        </div>
      </section>

      {/* 인용 */}
      {a.quote && (
        <section className="border-b-2 border-navy bg-coral">
          <div className="mx-auto max-w-4xl px-5 py-10 text-center md:px-8">
            <p className="font-display text-2xl leading-snug text-cream md:text-3xl">
              <span className="text-yellow">“</span>
              {a.quote[locale]}
              <span className="text-yellow">”</span>
            </p>
          </div>
        </section>
      )}

      {/* 본문 + 대표 사진 */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            {a.body[locale].map((para, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="text-lg leading-loose text-navy/85">{para}</p>
              </Reveal>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              {a.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-navy px-4 py-2 text-sm font-medium text-navy transition hover:bg-navy hover:text-cream"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
          <Reveal delay={120}>
            <RetroImage
              src={a.photo}
              alt={a.name[locale]}
              width={1280}
              height={720}
              frame={a.id === "mariko" ? "pink" : "coral"}
              rotate={2}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </section>

      {/* 사진 모음 */}
      <section className="mx-auto max-w-6xl px-5 pb-8 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {a.gallery.map((src, i) => (
            <Reveal key={src} delay={i * 80}>
              <RetroImage
                src={src}
                alt={a.name[locale]}
                width={1280}
                height={720}
                frame="navy"
                rotate={rotations[i % rotations.length]}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="aspect-square"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 디스코그래피 / 이력 */}
      <section className="border-y-2 border-navy bg-cream-deep/40">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8">
          <div>
            <SectionLabel tone="coral">{ui.common.discography[locale]}</SectionLabel>
            <ul className="mt-6 space-y-5">
              {a.discography.map((d, i) => (
                <li key={i} className="flex gap-4">
                  <span className="pixel w-20 shrink-0 text-sm text-coral-deep">{d.year}</span>
                  <div>
                    <p className="font-display text-lg text-navy">{d.title[locale]}</p>
                    {d.note && <p className="text-sm text-navy/60">{d.note[locale]}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>{ui.common.history[locale]}</SectionLabel>
            <ul className="mt-6 space-y-3 border-l-2 border-navy/30 pl-5">
              {a.history.map((h, i) => (
                <li key={i} className="relative">
                  <Star size={12} className="absolute -left-[26px] top-1.5 text-coral" />
                  <span className="pixel mr-3 text-xs text-coral-deep">{h.year}</span>
                  <span className="text-sm text-navy/80">{h.text[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTABlock locale={locale} />
    </>
  );
}

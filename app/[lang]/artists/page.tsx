import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, ui, type Locale } from "@/lib/i18n";
import { artists, duoIntro } from "@/lib/content";
import { SectionLabel, Star } from "@/components/ui";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return { title: ui.nav.artists[loc] };
}

export default async function ArtistsPage({
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
        <div aria-hidden className="groovy-soft groovy-spin pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full opacity-40" />
        <Star size={22} className="twinkle absolute left-[15%] top-16 text-pink" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8">
          <SectionLabel tone="cream">Artists</SectionLabel>
          <h1 className="mt-5 font-display text-5xl text-yellow text-shadow-pop md:text-7xl">
            {ui.nav.artists[locale]}
          </h1>
          <p className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-cream/85">
            {duoIntro[locale]}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {artists.map((a, i) => (
            <Reveal key={a.id} delay={i * 120} className="h-full">
              <Link
                href={`/${locale}/artists/${a.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-card border-2 border-navy bg-cream transition hover:-translate-y-1"
                style={{ boxShadow: "6px 6px 0 var(--color-navy)" }}
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-navy">
                  <Image
                    src={a.photo}
                    alt={a.name[locale]}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="print-tone object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border-2 border-navy bg-coral px-3 py-1 font-display text-xs text-cream">
                    {a.roman}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-heading text-4xl text-navy group-hover:text-coral">
                    {a.name[locale]}
                  </h2>
                  <p className="font-hand text-2xl text-teal">{a.tagline[locale]}</p>
                  <p className="mt-4 leading-relaxed text-navy/75">{a.lead[locale]}</p>
                  <span className="mt-auto pt-5 inline-block font-heading text-coral transition group-hover:translate-x-1">
                    {ui.common.readMore[locale]} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

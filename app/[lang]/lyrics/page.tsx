import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, tri, ui, type Locale} from "@/lib/i18n";
import { tracks } from "@/lib/content";
import { lyrics } from "@/lib/lyrics";
import { SectionLabel, Star } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return { title: ui.nav.lyrics[loc] };
}

export default async function LyricsIndex({
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
        <Star size={22} className="twinkle absolute right-[14%] top-14 text-yellow" />
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-24 md:px-8">
          <SectionLabel tone="cream">Lyrics</SectionLabel>
          <h1 className="mt-5 font-display text-5xl text-yellow text-shadow-pop md:text-6xl">
            {ui.nav.lyrics[locale]}
          </h1>
          <p className="mt-4 text-cream/80">
            {tri(
              locale,
              "전곡 가사를 한국어·일본어로 순차 공개합니다.",
              "全曲の歌詞は、韓国語・日本語で順次公開します。",
              "Lyrics for every track, published in turn in Korean and Japanese.",
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14 md:px-8">
        <ol className="overflow-hidden rounded-card border-2 border-navy">
        {tracks.map((tk, i) => (
          <li key={tk.slug} className={i % 2 === 0 ? "bg-cream" : "bg-cream-deep/60"}>
            <Link
              href={`/${locale}/lyrics/${tk.slug}`}
              className="group flex items-baseline gap-4 px-4 py-3.5 hover:bg-yellow/25"
            >
              <span className="pixel w-8 text-sm text-coral-deep">
                {String(tk.number).padStart(2, "0")}
              </span>
              <span className="flex-1 font-heading text-lg text-navy group-hover:text-coral">
                {tk.title[locale]}
              </span>
              {lyrics[tk.slug] ? (
                <span className="pixel rounded-full border border-coral-deep px-2 py-0.5 text-[10px] text-coral-deep">
                  ♪ {tri(locale, "가사", "歌詞", "Lyrics")}
                </span>
              ) : (
                <span className="pixel rounded-full border border-navy/25 px-2 py-0.5 text-[10px] text-navy/45">
                  {ui.cta.soon[locale]}
                </span>
              )}
              <span className="text-navy/40 transition group-hover:translate-x-1 group-hover:text-coral">
                →
              </span>
            </Link>
          </li>
        ))}
        </ol>
      </section>
    </>
  );
}

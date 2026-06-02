import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, ui, type Locale } from "@/lib/i18n";
import { tracks, getTrack } from "@/lib/content";
import { lyrics } from "@/lib/lyrics";
import { Star } from "@/components/ui";

export function generateStaticParams() {
  return tracks.flatMap((t) =>
    (["ko", "ja"] as const).map((lang) => ({ lang, slug: t.slug })),
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
  return { title: `${tk.title[loc]} — ${ui.nav.lyrics[loc]}` };
}

export default async function LyricsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const tk = getTrack(slug);
  if (!tk) notFound();
  const stanzas = lyrics[tk.slug];

  return (
    <>
      <section className="night relative overflow-hidden">
        <Star size={18} className="twinkle absolute right-[12%] top-12 text-yellow" />
        <div className="relative mx-auto max-w-2xl px-5 pb-12 pt-20 md:px-8">
          <Link href={`/${locale}/lyrics`} className="link-underline text-sm text-cream/70">
            ← {ui.nav.lyrics[locale]}
          </Link>
          <p className="pixel mt-6 text-sm text-yellow">
            TRACK {String(tk.number).padStart(2, "0")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-yellow text-shadow-pop md:text-5xl">
            {tk.title[locale]}
          </h1>
          {tk.pull && <p className="mt-3 font-hand text-xl text-cream">{tk.pull[locale]}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-14 md:px-8">
      {stanzas ? (
        <>
          <div className="mt-10 rounded-card border-2 border-navy bg-cream-deep/30 p-7 md:p-10">
            <div className="space-y-7">
              {stanzas.map((stanza, si) => (
                <div key={si} className="space-y-1.5">
                  {stanza.map((line, li) => (
                    <p
                      key={li}
                      className="text-center text-lg leading-relaxed text-navy/90"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Star size={14} className="text-coral" />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-navy/55">
            {locale === "ja"
              ? "原曲歌詞(韓国語)。日本語版(再解釈)はCDブックレットに収録予定です。"
              : "원곡 가사. 일본어 재해석 버전은 CD 부클릿(12P)에 함께 수록됩니다."}
          </p>
        </>
      ) : (
        <div className="mt-10 rounded-card border-2 border-dashed border-navy/40 bg-cream-deep/40 p-8 text-center">
          <Star size={24} className="mx-auto text-coral" />
          <span className="pixel mt-3 block text-xs uppercase tracking-widest text-navy/60">
            {ui.cta.soon[locale]}
          </span>
          <p className="mt-4 leading-relaxed text-navy/80">
            {locale === "ja"
              ? "この曲の歌詞は準備中です。全曲の韓国語・日本語歌詞は、CDブックレット(12P)および支援者向けの歌詞PDFに収録されます。"
              : "이 곡의 가사는 준비 중입니다. 전곡 가사는 CD 부클릿(12P)과 후원자 제공 가사지 PDF에 수록됩니다."}
          </p>
        </div>
      )}

      <Link
        href={`/${locale}/album/${tk.slug}`}
        className="mt-8 inline-block font-display text-coral hover:underline"
      >
        {ui.common.backToAlbum[locale]}
      </Link>
      </section>
    </>
  );
}

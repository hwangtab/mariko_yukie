import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, tri, type Locale} from "@/lib/i18n";
import { gallery } from "@/lib/content";
import { SectionLabel, Star } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Gallery from "@/components/Gallery";
import CTABlock from "@/components/CTABlock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return { title: loc === "ja" ? "ギャラリー" : "갤러리" };
}

export default async function GalleryPage({
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
        <Star size={24} className="twinkle absolute left-[12%] top-14 text-yellow" />
        <Star size={16} className="twinkle-2 absolute right-[16%] top-24 text-pink" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-24 md:px-8">
          <SectionLabel tone="cream">Gallery</SectionLabel>
          <h1 className="mt-5 font-display text-5xl text-yellow text-shadow-pop md:text-6xl">
            {tri(locale, "촬영의 하루", "撮影の一日", "A day on set")}
          </h1>
          <p className="mt-5 max-w-2xl text-cream/80">
            {tri(
              locale,
              "2026년 4월 21일, 서울 남산타워 일대. 뮤직비디오 「남산타워」 촬영의 기록.",
              "2026年4月21日、ソウル南山タワー一帯。ミュージックビデオ「南山タワー」撮影の記録。",
              "April 21, 2026, around Seoul's Namsan Tower — a record of the 'Namsan Tower' music-video shoot.",
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <Reveal>
          <Gallery items={gallery} locale={locale} />
        </Reveal>
      </section>

      <CTABlock locale={locale} />
    </>
  );
}

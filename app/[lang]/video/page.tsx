import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, tri, ui, type Locale } from "@/lib/i18n";
import { links, images } from "@/lib/content";
import { SectionLabel, Star } from "@/components/ui";
import CTABlock from "@/components/CTABlock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return { title: ui.nav.video[loc] };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const ytId = links.musicVideoYoutubeId;

  const concept = {
    ko: "두 사람이 서울 남산타워를 하루 동안 유람하는 영상입니다. 1970~80년대 쇼와 버라이어티 TV 프로그램의 감성으로 만들었습니다. 빈티지 필름 톤의 색보정, 이동·대기 장면의 코믹한 배속 편집, 8비트 픽셀 자막과 손글씨체 타이포그래피. 이 음반의 유머와 온도가 영상 안에서도 그대로 살아있습니다.",
    ja: "二人がソウル南山タワーを一日かけて巡る映像です。1970〜80年代の昭和バラエティTV番組の感性で作りました。ヴィンテージ・フィルムトーンの色補正、移動・待機シーンのコミカルな早回し編集、8ビットのピクセル字幕と手書き風タイポグラフィ。このアルバムのユーモアと温度が、映像の中にもそのまま生きています。",
    en: "A film of the two roaming Seoul's Namsan Tower over a single day, made in the spirit of 1970s–80s Showa-era variety TV. Vintage film-tone color grading, comically sped-up travel and waiting scenes, 8-bit pixel subtitles and handwritten typography. The album's humor and warmth live on inside the video too.",
  } as Record<Locale, string>;

  return (
    <>
      <section className="night relative overflow-hidden">
        <Star size={24} className="twinkle absolute left-[10%] top-12 text-yellow" />
        <Star size={16} className="twinkle-2 absolute right-[14%] top-24 text-pink" />
        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-24 md:px-8">
          <SectionLabel tone="cream">Music Video</SectionLabel>
          <h1 className="mt-5 font-display text-4xl text-yellow text-shadow-pop md:text-5xl">
            {tri(locale, "남산타워 Namsan Tower Lights", "南山タワー Namsan Tower Lights", "Namsan Tower Lights")}
          </h1>

          <div className="sticker mt-8 overflow-hidden rounded-card">
            {ytId ? (
              <div className="relative aspect-video bg-black">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                  title="Namsan Tower Lights"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative flex aspect-video items-center justify-center overflow-hidden">
                <Image src={images.towerNight} alt="" fill priority sizes="100vw" className="object-cover opacity-60" />
                <div className="absolute inset-0 bg-night/55" />
                <div className="relative text-center">
                  <span className="pixel text-2xl text-yellow">▶ {ui.cta.soon[locale]}</span>
                  <p className="mt-3 max-w-sm px-6 text-sm text-cream/80">
                    {tri(
                      locale,
                      "뮤직비디오는 텀블벅 펀딩 공개 시점에 공개될 예정입니다.",
                      "ミュージックビデオはファンディング公開時に公開予定です。",
                      "The music video will premiere when the Tumblbug campaign opens.",
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-16 md:px-8">
        <p className="text-lg leading-loose text-navy/85">{concept[locale]}</p>
        <p className="mt-6 font-hand text-2xl text-teal">
          {tri(
            locale,
            "2026년 4월 21일, 서울 남산타워 일대에서 촬영을 마쳤습니다.",
            "2026年4月21日、ソウル南山タワー一帯で撮影完了。",
            "Filmed around Seoul's Namsan Tower on April 21, 2026.",
          )}
        </p>
      </section>

      <CTABlock locale={locale} />
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, ui, type Locale } from "@/lib/i18n";
import { credits, links, album, images } from "@/lib/content";
import { SectionLabel } from "@/components/ui";
import CTABlock from "@/components/CTABlock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return { title: ui.nav.about[loc] };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const intro = {
    ko: "이 음반은 외부 투자 없이 두 아티스트가 스스로 만들고 스스로 내는 음반입니다. 30년 가까이 서울에 살며 한국 음악의 뿌리를 탐구해온 일본인 음악가와, 트로트를 사랑해 한국으로 건너온 일본인 가수가 음악적 동반자로서 함께 만든 결과물입니다.",
    ja: "このアルバムは、外部の投資なしに二人のアーティストが自ら作り、自ら世に出すアルバムです。30年近くソウルに暮らし韓国音楽の根を探究してきた日本人音楽家と、トロットを愛して韓国へ渡った日本人歌手が、音楽的な伴侶として共に作り上げた結果です。",
  };

  return (
    <>
      <section className="night relative overflow-hidden">
        <Image src={images.deck} alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-night/70" />
        <div className="relative mx-auto max-w-3xl px-5 py-20 md:px-8">
          <SectionLabel tone="cream">About</SectionLabel>
          <h1 className="mt-5 font-display text-5xl text-yellow text-shadow-pop">
            {album.title[locale]}
          </h1>
          <p className="mt-7 text-balance text-lg leading-relaxed text-cream/85">{intro[locale]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <SectionLabel tone="coral">
          {locale === "ja" ? "プロジェクトチーム" : "프로젝트 팀"}
        </SectionLabel>
        <dl className="mt-6 overflow-hidden rounded-card border-2 border-navy">
          {credits.map((c, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 gap-4 px-5 py-3.5 ${i % 2 === 0 ? "bg-cream" : "bg-cream-deep/50"}`}
            >
              <dt className="col-span-1 text-sm text-navy/60">{c.role[locale]}</dt>
              <dd className="col-span-2 font-display text-navy">{c.name[locale]}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-navy/55">
          {locale === "ja"
            ? "デザイン・撮影チームの正式クレジットは、公開協議のうえ順次追加します。"
            : "디자인·촬영 팀의 정식 크레딧은 공개 협의 후 순차 추가됩니다."}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8">
        <SectionLabel tone="coral">{ui.common.contactMedia[locale]}</SectionLabel>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${links.contactEmail}`}
            className="rounded-full border-2 border-navy px-5 py-2.5 text-navy transition hover:bg-navy hover:text-cream"
          >
            ✉ {links.contactEmail}
          </a>
          <a
            href={links.sns.yukieYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-navy px-5 py-2.5 text-navy transition hover:bg-navy hover:text-cream"
          >
            YouTube ↗
          </a>
          <a
            href={links.sns.marikoInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-navy px-5 py-2.5 text-navy transition hover:bg-navy hover:text-cream"
          >
            Instagram ↗
          </a>
        </div>
      </section>

      <CTABlock locale={locale} />
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, tri, ui, type Locale} from "@/lib/i18n";
import {
  album,
  artists,
  tracks,
  duoIntro,
  images,
  gallery,
  story,
  towerFacts,
} from "@/lib/content";
import {
  SectionLabel,
  Star,
  Ribbon,
  WaveDivider,
  GroovyWave,
  StarScatter,
} from "@/components/ui";
import HeroFrame from "@/components/HeroFrame";
import Reveal from "@/components/Reveal";
import RetroImage from "@/components/RetroImage";
import TrackList from "@/components/TrackList";
import Gallery from "@/components/Gallery";
import CTABlock from "@/components/CTABlock";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const featured = tracks.filter((t) => [5, 3, 7, 10].includes(t.number));
  const heroSlides = [
    { src: "/images/namsan_69.webp", caption: tri(locale, "남산 야경 아래, 두 사람", "南山の夜景の下、二人", "Under Namsan's night view") },
    { src: "/images/namsan_12.webp", caption: tri(locale, "무대 위", "ステージの上", "On stage") },
    { src: "/images/namsan_19.webp", caption: tri(locale, "흥겨운 무대", "盛り上がるステージ", "A lively stage") },
    { src: "/images/namsan_08.webp", caption: tri(locale, "그룹 사운드", "グループサウンド", "Group sound") },
    { src: "/images/namsan_71.webp", caption: tri(locale, "남산타워, 초록빛 밤", "南山タワー、緑の夜", "Namsan Tower, a green night") },
  ];

  return (
    <>
      {/* ════════ HERO — 풀블리드 무지개 프레임 + 야경 사진 캐러셀 ════════ */}
      <HeroFrame
        slides={heroSlides}
        title={album.title[locale]}
        roman={album.titleRoman}
        concept={album.concept[locale]}
        ribbon="Mariko & Yukie · 1st Album"
        release={album.releaseLabel[locale]}
        primary={{ label: `${ui.common.tracklist[locale]} →`, href: `/${locale}/album` }}
        secondary={{ label: `${ui.cta.watchMV[locale]} →`, href: `/${locale}/video` }}
      />

      {/* ════════ 두 사람 + 아티스트 (핑크 워시 밴드) ════════ */}
      <section className="bg-wash-pink">
       <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="relative">
              <RetroImage
                src={images.walk}
                alt={tri(locale, "서울을 걷는 두 사람", "ソウルを歩く二人", "The two walking in Seoul")}
                width={1280}
                height={720}
                frame="coral"
                rotate={-2}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute -bottom-5 -right-3 rotate-3">
                <Ribbon>서울 · ソウル</Ribbon>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionLabel tone="coral">Mariko &amp; Yukie</SectionLabel>
            <p className="mt-5 text-balance text-xl font-medium leading-relaxed text-navy/90 md:text-2xl">
              {duoIntro[locale]}
            </p>
            <Link
              href={`/${locale}/artists`}
              className="link-underline mt-6 inline-block font-heading text-coral"
            >
              {ui.nav.artists[locale]} →
            </Link>
          </Reveal>
        </div>
       </div>

       {/* 아티스트 카드 */}
       <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {artists.map((a, i) => (
            <Reveal key={a.id} delay={i * 120} className="h-full">
              <Link
                href={`/${locale}/artists/${a.id}`}
                className="group flex h-full gap-5 rounded-card border-2 border-navy bg-cream p-5 transition hover:-translate-y-1 hover:bg-yellow/15"
              >
                <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-navy">
                  <Image
                    src={a.photo}
                    alt={a.name[locale]}
                    fill
                    sizes="120px"
                    className="print-tone object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <span className="pixel text-[11px] text-coral-deep">{a.roman}</span>
                  <h3 className="font-heading text-3xl text-navy group-hover:text-coral">
                    {a.name[locale]}
                  </h3>
                  <p className="font-hand text-xl text-teal">{a.tagline[locale]}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/70">
                    {a.lead[locale]}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
       </div>
      </section>

      <GroovyWave />

      {/* ════════ 앨범 피처 ════════ */}
      <section className="relative overflow-hidden border-b-2 border-navy bg-wash-blue">
        <div
          aria-hidden
          className="groovy-soft pointer-events-none absolute inset-0 opacity-60"
          style={{ ["--gx" as string]: "85%", ["--gy" as string]: "20%" }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <Reveal>
            <div className="relative mx-auto max-w-sm">
              <Image
                src={images.cover}
                alt={`${album.title[locale]} ${album.titleRoman}`}
                width={1280}
                height={1280}
                sizes="(max-width: 768px) 80vw, 400px"
                className="sticker w-full rounded-card"
              />
              <Star size={34} className="twinkle absolute -left-5 -top-5 text-coral" />
              <Star size={20} className="twinkle-2 absolute -bottom-3 -right-2 text-pink" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionLabel tone="coral">{ui.common.tracklist[locale]}</SectionLabel>
            <h2 className="mt-4 font-display text-4xl leading-tight text-navy md:text-5xl">
              {tri(locale, "총 15트랙", "全15トラック", "15 tracks")}
            </h2>
            <p className="mt-3 leading-relaxed text-navy/75">{album.concept[locale]}</p>
            <ul className="mt-5 space-y-2">
              {featured.map((tk) => (
                <li key={tk.slug}>
                  <Link
                    href={`/${locale}/album/${tk.slug}`}
                    className="group flex items-baseline gap-3"
                  >
                    <span className="pixel text-coral-deep">
                      {String(tk.number).padStart(2, "0")}
                    </span>
                    <span className="font-heading text-lg text-navy group-hover:text-coral">
                      {tk.title[locale]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/album`}
              className="link-underline mt-6 inline-block font-heading text-coral"
            >
              {tri(locale, "앨범 보러가기", "アルバムを見る", "See the album")} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ════════ 음악의 뿌리 (민트 워시) ════════ */}
      <section className="bg-wash-mint">
       <div className="relative mx-auto max-w-5xl px-5 py-20 md:px-8">
        <StarScatter />
        <Reveal>
          <div className="relative text-center">
            <SectionLabel>{tri(locale, "음악의 뿌리", "音楽のルーツ", "Roots of the music")}</SectionLabel>
            <h2 className="mt-4 font-display text-4xl text-navy md:text-5xl">
              {tri(locale, "이 소리는 어디서 왔나", "この音はどこから来たのか", "Where did this sound come from?")}
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 space-y-5">
          {story.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <article
                className={`rounded-card border-2 border-navy p-6 md:p-8 ${
                  i % 3 === 0 ? "bg-coral/10" : i % 3 === 1 ? "bg-blue/10" : "bg-pink/10"
                }`}
              >
                <span className="pixel text-xs text-coral-deep">{s.kicker[locale]}</span>
                <h3 className="mt-2 font-display text-2xl text-navy md:text-3xl">
                  {s.title[locale]}
                </h3>
                <p className="mt-3 leading-loose text-navy/80">{s.body[locale]}</p>
              </article>
            </Reveal>
          ))}
        </div>
       </div>
      </section>

      <GroovyWave />

      {/* ════════ 갤러리 티저 (라일락 워시) ════════ */}
      <section className="bg-wash-lilac">
       <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <SectionLabel tone="coral">Gallery</SectionLabel>
              <h2 className="mt-3 font-display text-4xl text-navy">
                {tri(locale, "촬영의 하루", "撮影の一日", "A day on set")}
              </h2>
            </div>
            <Link
              href={`/${locale}/gallery`}
              className="link-underline hidden font-heading text-coral sm:block"
            >
              {tri(locale, "더 보기", "もっと見る", "See more")} →
            </Link>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-8">
            <Gallery items={gallery.slice(0, 6)} locale={locale} />
          </div>
        </Reveal>
        <Link
          href={`/${locale}/gallery`}
          className="link-underline mt-6 inline-block font-heading text-coral sm:hidden"
        >
          {tri(locale, "더 보기", "もっと見る", "See more")} →
        </Link>
       </div>
      </section>

      <WaveDivider from="var(--color-wash-lilac)" to="var(--color-night)" />

      {/* ════════ 남산타워 트리비아 ════════ */}
      <section className="night relative overflow-hidden">
        <Image
          src={images.towerNight}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-night/70" />
        <div className="relative mx-auto max-w-5xl px-5 py-20 md:px-8">
          <SectionLabel tone="cream">
            {tri(locale, "남산타워 이야기", "南山タワーのこと", "About Namsan Tower")}
          </SectionLabel>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl leading-snug text-cream md:text-4xl">
            {tri(
              locale,
              "그들에게 명소가 아니라, 동네 랜드마크.",
              "彼らにとって名所ではなく、近所のランドマーク。",
              "Not a sight to visit — the landmark in their neighborhood.",
            )}
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {towerFacts.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-night-line bg-night-deep/50 px-4 py-3"
              >
                <Star size={14} className="mt-1 shrink-0 text-yellow" />
                <span className="text-cream/85">{t.fact[locale]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 전체 트랙리스트 */}
      <section className="mx-auto max-w-3xl px-5 py-20 md:px-8">
        <Reveal>
          <SectionLabel tone="coral">
            {album.title[locale]} · {album.titleRoman}
          </SectionLabel>
          <div className="mt-6">
            <TrackList locale={locale} />
          </div>
        </Reveal>
      </section>

      <CTABlock locale={locale} />
    </>
  );
}

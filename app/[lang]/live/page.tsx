import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, tri, ui, type Locale } from "@/lib/i18n";
import { events } from "@/lib/content";
import { SectionLabel, Star } from "@/components/ui";
import Reveal from "@/components/Reveal";
import CTABlock from "@/components/CTABlock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return { title: ui.nav.live[loc] };
}

const statusLabel = {
  tentative: { ko: "미정", ja: "未定", en: "TBD" },
  confirmed: { ko: "확정", ja: "確定", en: "Confirmed" },
  past: { ko: "종료", ja: "終了", en: "Past" },
};
const typeTone = { release: "bg-coral/15", tour: "bg-blue/15", news: "bg-yellow/20" } as const;

export default async function LivePage({
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
        <div aria-hidden className="groovy-soft groovy-spin pointer-events-none absolute -left-28 top-0 h-80 w-80 rounded-full opacity-40" />
        <Star size={22} className="twinkle absolute right-[16%] top-16 text-yellow" />
        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-24 md:px-8">
          <SectionLabel tone="cream">Live &amp; News</SectionLabel>
          <h1 className="mt-5 font-display text-5xl text-yellow text-shadow-pop md:text-6xl">
            {ui.nav.live[locale]}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <div className="space-y-6">
          {events.map((ev, i) => (
            <Reveal key={ev.id} delay={i * 100}>
              <article className={`rounded-card border-2 border-navy p-7 ${typeTone[ev.type]}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="pixel text-sm text-coral-deep">{ev.dateLabel[locale]}</span>
                  <span className="rounded-full border-2 border-navy/30 px-2 py-0.5 text-[10px] text-navy/60">
                    {statusLabel[ev.status][locale]}
                  </span>
                </div>
                <h2 className="mt-3 font-heading text-2xl text-navy">{ev.title[locale]}</h2>
                <p className="mt-2 text-sm text-navy/70">📍 {ev.venue[locale]}</p>
                <p className="mt-3 leading-relaxed text-navy/80">{ev.note[locale]}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-navy/60">
          {tri(
            locale,
            "공연 장소·날짜는 확정되는 대로 이곳과 텀블벅에서 안내합니다.",
            "公演の場所・日程は確定次第、こちらと텀블벅でお知らせします。",
            "Venue and dates will be announced here and on Tumblbug as soon as they're confirmed.",
          )}
        </p>
      </section>

      <CTABlock locale={locale} />
    </>
  );
}

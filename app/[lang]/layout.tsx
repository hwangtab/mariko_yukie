import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { album } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const titles: Record<Locale, string> = {
    ko: "마리코 & 유키에 — 남산타워",
    ja: "マリコ & ユキエ — 南山タワー",
    en: "Mariko & Yukie — Namsan Tower",
  };
  const ogLocales: Record<Locale, string> = { ko: "ko_KR", ja: "ja_JP", en: "en_US" };
  const keywordSets: Record<Locale, string[]> = {
    ko: ["마리코", "유키에", "사토유키에", "곱창전골", "남산타워", "트로트", "한국 록", "Mariko & Yukie"],
    ja: ["マリコ", "ユキエ", "佐藤行衛", "コプチャンチョンゴル", "南山タワー", "トロット", "韓国ロック"],
    en: ["Mariko & Yukie", "Sato Yukie", "Kopchangjeongol", "Namsan Tower", "trot", "Korean rock", "Seoul indie"],
  };
  const title = titles[loc];
  const description = album.concept[loc];
  const siteName = album.artist[loc];

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://marikoyukie.vercel.app",
    ),
    title: { default: title, template: `%s — ${album.artistRoman}` },
    description,
    applicationName: siteName,
    keywords: keywordSets[loc],
    alternates: {
      languages: { ko: "/ko", ja: "/ja", en: "/en", "x-default": "/ko" },
    },
    openGraph: {
      siteName,
      title,
      description,
      url: `/${loc}`,
      locale: ogLocales[loc],
      alternateLocale: locales.filter((l) => l !== loc).map((l) => ogLocales[l]),
      type: "website",
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: `${album.title[loc]} — ${album.artistRoman}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const loc = lang as Locale;

  return (
    <html lang={loc} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Mochiy+Pop+One&family=Black+Han+Sans&family=Jua&family=Gowun+Dodum&family=Zen+Maru+Gothic:wght@400;500;700;900&family=Gaegu:wght@400;700&family=DotGothic16&display=swap"
          rel="stylesheet"
        />
        {/* JS 미동작 시에도 스크롤 등장 콘텐츠가 보이도록 폴백 */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className={`grain bg-cream-grain ${loc === "ja" ? "lang-ja" : ""}`}>
        <Header locale={loc} />
        <main>{children}</main>
        <Footer locale={loc} />
      </body>
    </html>
  );
}

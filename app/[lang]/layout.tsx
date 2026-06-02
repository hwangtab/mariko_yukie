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
  const title =
    loc === "ja" ? "マリコ & ユキエ — 南山タワー" : "마리코 & 유키에 — 남산타워";
  const description =
    loc === "ja" ? album.concept.ja : album.concept.ko;
  return {
    title: { default: title, template: `%s — ${album.artistRoman}` },
    description,
    openGraph: {
      title,
      description,
      locale: loc === "ja" ? "ja_JP" : "ko_KR",
      type: "website",
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

import type { Metadata } from "next";
import { album } from "@/lib/content";
import { locales, type Locale } from "@/lib/i18n";
import { getSiteUrl } from "@/content/data/site";

const ogLocales: Record<Locale, string> = { ko: "ko_KR", ja: "ja_JP", en: "en_US" };

function normalizePath(path: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  imageAlt,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  imageAlt?: string;
}): Metadata {
  const normalizedPath = normalizePath(path);
  const canonical = getSiteUrl(`/${locale}${normalizedPath}`);
  const languages = Object.fromEntries([
    ...locales.map((loc) => [loc, getSiteUrl(`/${loc}${normalizedPath}`)]),
    ["x-default", getSiteUrl(`/ko${normalizedPath}`)],
  ]);

  const ogImage = {
    url: "/og.jpg",
    width: 1200,
    height: 630,
    alt: imageAlt ?? `${album.title[locale]} — ${album.artistRoman}`,
  };

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      siteName: album.artist[locale],
      title,
      description,
      url: canonical,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((loc) => loc !== locale).map((loc) => ogLocales[loc]),
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

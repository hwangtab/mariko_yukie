import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { tracks, artists } from "@/lib/content";

// 도메인 확정 시 NEXT_PUBLIC_SITE_URL 환경변수로 교체
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mariko-yukie.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/artists", "/album", "/video", "/gallery", "/lyrics", "/live", "/about"];
  const dynamicPaths = [
    ...artists.map((a) => `/artists/${a.id}`),
    ...tracks.map((t) => `/album/${t.slug}`),
    ...tracks.map((t) => `/lyrics/${t.slug}`),
  ];
  const all = [...staticPaths, ...dynamicPaths];

  return locales.flatMap((loc) =>
    all.map((p) => ({
      url: `${base}/${loc}${p}`,
      lastModified: new Date("2026-06-02"),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}${p}`]),
        ),
      },
    })),
  );
}

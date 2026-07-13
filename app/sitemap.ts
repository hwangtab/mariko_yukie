import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { tracks, artists } from "@/lib/content";
import { getContentUpdatedAt, getSiteUrl } from "@/content/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getContentUpdatedAt();
  const staticPaths = ["", "/artists", "/album", "/video", "/gallery", "/lyrics", "/live", "/about"];
  const dynamicPaths = [
    ...artists.map((a) => `/artists/${a.id}`),
    ...tracks.map((t) => `/album/${t.slug}`),
    ...tracks.map((t) => `/lyrics/${t.slug}`),
  ];
  const all = [...staticPaths, ...dynamicPaths];

  return locales.flatMap((loc) =>
    all.map((p) => ({
      url: getSiteUrl(`/${loc}${p}`),
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, getSiteUrl(`/${l}${p}`)]),
        ),
      },
    })),
  );
}

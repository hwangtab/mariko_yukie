export type SitePhase = "funding" | "preRelease" | "released" | "postCampaign";

export const fallbackSiteUrl = "https://marikoyukie.vercel.app";
export const campaignPhase: SitePhase = "funding";

export const siteConfig = {
  name: "Mariko & Yukie",
  defaultSiteUrl: fallbackSiteUrl,
  campaignPhase,
} as const;

export function getSiteUrl(path = ""): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, "");
  if (!path) return base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

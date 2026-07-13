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

// git 이력을 읽을 수 없는 빌드 환경에서 쓰는 값. 콘텐츠를 크게 고칠 때 함께 올린다.
export const fallbackContentUpdatedAt = "2026-07-07";

/** 콘텐츠 최종 수정 시각. next.config.ts가 content/lib/app의 마지막 커밋 시각을 주입한다. */
export function getContentUpdatedAt(): Date {
  const injected = process.env.CONTENT_UPDATED_AT;
  if (injected) {
    const parsed = new Date(injected);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date(fallbackContentUpdatedAt);
}

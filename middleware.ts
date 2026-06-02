import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n";

// 로케일 접두사가 없는 경로를 적절한 언어로 리다이렉트 (docs/website/04-i18n-strategy.md)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  );
  if (hasLocale) return NextResponse.next();

  // 사용자가 이전에 고른 언어 우선, 없으면 Accept-Language로 1회 분기
  const cookieLocale = req.cookies.get("locale")?.value;
  const accept = req.headers.get("accept-language") ?? "";
  const lower = accept.toLowerCase();
  const preferred =
    cookieLocale && locales.includes(cookieLocale as never)
      ? cookieLocale
      : lower.startsWith("ja")
        ? "ja"
        : lower.startsWith("en")
          ? "en"
          : defaultLocale;

  const url = req.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // 정적 파일·이미지·API 제외
  matcher: ["/((?!_next|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};

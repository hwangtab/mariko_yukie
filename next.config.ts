import { execFileSync } from "node:child_process";
import type { NextConfig } from "next";

// sitemap의 lastmod 신호. 콘텐츠·페이지 소스의 마지막 커밋 시각을 읽어
// 실제로 내용이 바뀐 배포에서만 날짜가 움직이게 한다.
// git 이력이 없는 빌드 환경에서는 빈 값을 넘기고 site.ts의 상수로 폴백한다.
function contentUpdatedAt(): string {
  try {
    return execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", "content", "lib", "app"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  // 이미지는 빌드 전 WebP로 미리 최적화해 public/images에 배치하고,
  // next/image는 레이아웃·지연로딩만 담당(unoptimized).
  images: {
    unoptimized: true,
  },
  env: {
    CONTENT_UPDATED_AT: contentUpdatedAt(),
  },
};

export default nextConfig;

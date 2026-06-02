import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지는 빌드 전 WebP로 미리 최적화해 public/images에 배치하고,
  // next/image는 레이아웃·지연로딩만 담당(unoptimized).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

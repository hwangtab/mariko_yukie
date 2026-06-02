"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ribbon, Star, Stamp, Sun, Heart } from "./ui";

type Slide = { src: string; caption: string };
type Cta = { label: string; href: string };

export default function HeroFrame({
  slides,
  title,
  roman,
  concept,
  ribbon,
  release,
  primary,
  secondary,
}: {
  slides: Slide[];
  title: string;
  roman: string;
  concept: string;
  ribbon: string;
  release: string;
  primary: Cta;
  secondary: Cta;
}) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-cream">
      {/* 무지개 동심원 프레임 (빙글빙글 회전) */}
      <div
        aria-hidden
        className="groovy-rings groovy-spin pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 opacity-95"
        style={{ ["--gx" as string]: "50%", ["--gy" as string]: "32%" }}
      />
      <Sun size={52} className="spin-slow-rev absolute left-6 top-32 z-30 hidden text-yellow drop-shadow md:block" />
      <Heart size={28} className="float-y absolute right-8 top-36 z-30 hidden text-coral-deep md:block" />

      {/* 중앙 야경 창 — 사진 캐러셀 */}
      <div
        className="night absolute inset-4 overflow-hidden rounded-[28px] border-4 border-navy sm:inset-7 md:inset-12 md:rounded-[44px] lg:inset-16"
        style={{ boxShadow: "8px 8px 0 var(--color-navy)" }}
      >
        {slides.map((s, idx) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
            aria-hidden={idx !== i}
          >
            <Image
              src={s.src}
              alt=""
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover object-center opacity-80 ${idx === i ? "kenburns" : ""}`}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-night-deep/65 via-night/25 to-night/85" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-night/35 blur-3xl"
        />
        <Star size={24} className="twinkle absolute right-[10%] top-[14%] text-yellow" />
        <Star size={15} className="twinkle-2 absolute left-[11%] top-[22%] text-pink" />

        {/* 콘텐츠 */}
        <div className="relative flex h-full flex-col items-center justify-center px-6 py-16 text-center md:px-12">
          <div className="rise" style={{ animationDelay: "60ms" }}>
            <Ribbon>{ribbon}</Ribbon>
          </div>
          <h1
            className="rise mt-5 pb-2 font-display text-[19vw] leading-[0.95] text-yellow text-shadow-pop sm:text-[16vw] md:text-[10rem]"
            style={{ animationDelay: "160ms" }}
          >
            {title}
          </h1>
          <p className="rise mt-3 font-display text-xl text-cream md:text-2xl" style={{ animationDelay: "260ms" }}>
            {roman}
          </p>
          <p
            className="rise mt-5 max-w-xl text-balance leading-relaxed text-cream/85 md:text-lg"
            style={{ animationDelay: "360ms" }}
          >
            {concept}
          </p>
          <div className="rise mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "470ms" }}>
            <Link
              href={primary.href}
              className="sticker sticker-coral rounded-full bg-coral px-8 py-3.5 font-display text-cream transition hover:-translate-y-1 hover:bg-coral-deep"
            >
              {primary.label}
            </Link>
            <Link
              href={secondary.href}
              className="rounded-full border-2 border-cream/80 px-7 py-3.5 font-display text-cream transition hover:-translate-y-1 hover:bg-cream hover:text-night"
            >
              {secondary.label}
            </Link>
          </div>
          <div className="rise mt-6" style={{ animationDelay: "560ms" }}>
            <Stamp tone="navy">
              <span className="text-cream">{release}</span>
            </Stamp>
          </div>
        </div>

        {/* 좌우 버튼 */}
        <button
          onClick={() => go(-1)}
          aria-label="이전 사진"
          className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cream/70 bg-night/30 text-xl text-cream backdrop-blur transition hover:border-coral hover:bg-coral md:flex"
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          aria-label="다음 사진"
          className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cream/70 bg-night/30 text-xl text-cream backdrop-blur transition hover:border-coral hover:bg-coral md:flex"
        >
          ›
        </button>

        {/* 캡션 + 도트 */}
        <div className="absolute inset-x-0 bottom-5 z-10 flex flex-col items-center gap-2">
          <span className="font-hand text-sm text-cream/75">{slides[i].caption}</span>
          <div className="flex gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.src}
                onClick={() => setI(idx)}
                aria-label={`슬라이드 ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-coral" : "w-2 bg-cream/50 hover:bg-cream/80"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 상단 스크림 — 헤더 가독성 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-night/65 to-transparent"
      />
    </section>
  );
}

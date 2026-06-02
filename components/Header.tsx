"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ui, type Locale } from "@/lib/i18n";

const navKeys = ["artists", "album", "video", "gallery", "live", "about"] as const;

export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const other: Locale = locale === "ko" ? "ja" : "ko";
  const rest = pathname.replace(/^\/(ko|ja)/, "");
  const otherHref = `/${other}${rest || ""}`;
  const home = `/${locale}`;
  const isActive = (key: string) => pathname.startsWith(`/${locale}/${key}`);

  const dark = !scrolled && !open; // 상단(미스크롤) = 어두운 히어로 위 → 밝은 텍스트

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        dark
          ? "border-b-2 border-transparent bg-transparent"
          : "border-b-2 border-navy bg-cream/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link href={home} className="group flex items-center gap-2">
          <span className="font-display text-2xl leading-none text-coral outline-navy-thin transition group-hover:text-pink">
            M<span className="text-yellow">&amp;</span>Y
          </span>
          <span
            className={`hidden font-display text-sm leading-none sm:inline ${dark ? "text-cream" : "text-navy"}`}
          >
            마리코 &amp; 유키에
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className={`link-underline text-sm font-medium ${
                isActive(key)
                  ? dark
                    ? "text-yellow"
                    : "text-coral"
                  : dark
                    ? "text-cream/85 hover:text-yellow"
                    : "text-navy/80 hover:text-coral"
              }`}
            >
              {ui.nav[key][locale]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href={otherHref}
            prefetch={false}
            onClick={() => {
              document.cookie = `locale=${other};path=/;max-age=31536000`;
            }}
            className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition ${
              dark
                ? "border-cream/70 text-cream hover:bg-cream hover:text-navy"
                : "border-navy text-navy hover:bg-navy hover:text-cream"
            }`}
            aria-label="Switch language"
          >
            {locale === "ko" ? "日本語" : "한국어"}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 md:hidden ${
              dark ? "border-cream/70 text-cream" : "border-navy text-navy"
            }`}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className="text-lg leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t-2 border-navy bg-cream px-5 py-3 md:hidden">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className="block py-2.5 font-display text-xl text-navy"
            >
              {ui.nav[key][locale]}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

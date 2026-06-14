import Link from "next/link";
import { tri, ui, type Locale } from "@/lib/i18n";
import { links, album } from "@/lib/content";
import { Star } from "./ui";

export default function Footer({ locale }: { locale: Locale }) {
  const sns = [
    { label: "Instagram", href: links.sns.marikoInstagram },
    { label: "Twitter / X", href: links.sns.marikoTwitter },
    { label: "YouTube", href: links.sns.yukieYoutube },
    { label: "Facebook", href: links.sns.yukieFacebook },
  ];
  return (
    <footer className="night relative overflow-hidden">
      <div
        aria-hidden
        className="groovy-soft groovy-spin pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full opacity-40"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl leading-none text-yellow outline-navy-thin">
              {album.artist[locale]}
            </p>
            <p className="pixel mt-3 text-xs text-cream/60">
              {album.title[locale]}
              {locale !== "en" && ` · ${album.titleRoman}`}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              {album.concept[locale]}
            </p>
          </div>

          <div>
            <h3 className="pixel flex items-center gap-2 text-xs uppercase tracking-widest text-pink">
              <Star size={11} className="text-pink" /> Social
            </h3>
            <ul className="mt-4 space-y-2">
              {sns.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-cream/85"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="pixel flex items-center gap-2 text-xs uppercase tracking-widest text-blue">
              <Star size={11} className="text-blue" /> {ui.common.contactMedia[locale]}
            </h3>
            <a
              href={`mailto:${links.contactEmail}`}
              className="link-underline mt-4 block text-sm text-cream/85"
            >
              {links.contactEmail}
            </a>
            <Link
              href={`/${locale}/about`}
              className="link-underline mt-2 block text-sm text-cream/85"
            >
              {ui.nav.about[locale]} →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-night-line pt-6 text-xs text-cream/45 sm:flex-row sm:items-center">
          <span>© 2026 Mariko &amp; Yukie · {tri(locale, "스튜디오 놀", "スタジオ・ノル", "Studio Nol")}</span>
          <span className="pixel">서울 · ソウル · SEOUL</span>
        </div>
      </div>
    </footer>
  );
}

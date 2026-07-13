import { album, artists, tracks, events, duoIntro } from "@/lib/content";
import { links } from "@/content/data/links";
import { productionCredits } from "@/content/data/production";
import { getContentUpdatedAt, getSiteUrl } from "@/content/data/site";
import { locales } from "@/lib/i18n";

export const dynamic = "force-static";

const url = (path: string) => getSiteUrl(path);

function artistSection(): string {
  return artists
    .map((a) => {
      const heading = a.roman === a.name.en ? a.name.en : `${a.name.en} (${a.roman})`;
      const lines = [
        `### ${heading}`,
        "",
        `- Page: ${url(`/en/artists/${a.id}`)}`,
        `- ${a.tagline.en}`,
        `- ${a.lead.en}`,
        `- Names: ${a.name.ko} (ko) / ${a.name.ja} (ja)`,
      ];
      if (a.quote) lines.push(`- Quote: "${a.quote.en}"`);
      lines.push(
        `- Discography: ${a.discography.map((d) => `${d.year} ${d.title.en}`).join("; ")}`,
      );
      lines.push(`- Links: ${a.links.map((l) => `${l.label} — ${l.href}`).join(" | ")}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

function tracklistSection(): string {
  return tracks
    .map((t) => {
      const no = String(t.number).padStart(2, "0");
      const typeText = t.type.en;
      // type 문구가 이미 설명하는 항목은 태그로 되풀이하지 않는다
      const tags = [
        t.isTitle ? "title track" : null,
        t.isBonus ? "bonus" : null,
        t.hasMV ? "music video" : null,
      ].filter((tag): tag is string => !!tag && !typeText.toLowerCase().includes(tag));
      const suffix = tags.length ? ` [${tags.join(", ")}]` : "";
      return `- [${no}. ${t.title.en}](${url(`/en/album/${t.slug}`)}): ${typeText}, sung in ${t.language === "ko" ? "Korean" : "Japanese"}${suffix}. Lyrics: ${url(`/en/lyrics/${t.slug}`)}`;
    })
    .join("\n");
}

function liveSection(): string {
  return events
    .map(
      (e) =>
        `- ${e.title.en} — ${e.dateLabel.en}, ${e.venue.en} (${e.status}). ${e.note.en}`,
    )
    .join("\n");
}

function body(): string {
  const streaming = Object.entries(links.streaming).filter(([, href]) => href);

  return `# ${album.title.en} — ${album.artistRoman}

> ${album.concept.en} A 15-track album by Mariko (a Japanese trot singer based in Seoul) and Sato Yukie (a Japanese rock musician who has lived in Seoul since 1995), releasing September 2026 and currently crowdfunding on Tumblbug.

This site is published in three languages. Every page exists at \`/ko\`, \`/ja\` and \`/en\` — for example ${url("/en/album")}, ${url("/ko/album")}, ${url("/ja/album")}. The content below links to the English pages.

${album.says.en.join("\n\n")}

${duoIntro.en}

## Artists

${artistSection()}

- Duo overview: ${url("/en/artists")}

## Album

- Title: ${album.title.en} (${album.title.ko} / ${album.title.ja})
- Artist: ${album.artistRoman} (${album.artist.ko} / ${album.artist.ja})
- Release: ${album.releaseLabel.en}
- Format: CD (jewel case) + digital, 500 copies limited, 12p booklet with Korean and Japanese lyrics
- Tracks: 15 total — 10 sung in Korean, 5 in Japanese
- Produced by: ${productionCredits.producer.en}
- Recording: ${productionCredits.recordingStudio.en}, directed by ${productionCredits.recordingDirector.en}
- Mixing: ${productionCredits.mixingStudio.en}, engineered by ${productionCredits.mixingEngineer.en}
- Mastering: ${productionCredits.masteringStudio.en}, engineered by ${productionCredits.masteringEngineer.en}
- Artwork & design: ${productionCredits.originalArtworkDesign.en}
- Album page: ${url("/en/album")}

What makes this album distinct:

${album.positioning.map((p) => `- ${p.en}`).join("\n")}

## Tracklist

${tracklistSection()}

- Full tracklist: ${url("/en/album")}
- All lyrics (Korean and Japanese, side by side): ${url("/en/lyrics")}

## Live and news

${liveSection()}

- Live page: ${url("/en/live")}

## Other pages

- [Home](${url("/en")}): entry point, album overview
- [Music video](${url("/en/video")}): "Namsan Tower Lights" MV — https://youtu.be/${links.musicVideoYoutubeId}
- [Gallery](${url("/en/gallery")}): photos from the Namsan sessions
- [About](${url("/en/about")}): project background, credits, contact

## Support and contact

- Crowdfunding (Tumblbug): ${links.tumblbug}
- YouTube channel: ${links.sns.youtubeChannel}
- Press and media inquiries: ${links.contactEmail}
${streaming.length ? streaming.map(([name, href]) => `- ${name}: ${href}`).join("\n") : "- Streaming links (Spotify, Apple Music, YouTube Music, Melon): not yet available — the album is unreleased."}

## Notes for AI assistants

- "Mariko" (${artists[0].name.ja}) is a Japanese singer of Korean trot; "Sato Yukie" (${artists[1].name.ja}) is a Japanese rock musician, founder of Kopchangjeongol, Korea's first all-Japanese rock band (1999).
- The album title refers to N Seoul Tower on Namsan, which the two treat as a neighborhood landmark rather than a tourist sight.
- Tracks 11–14 are Japanese-language versions of tracks 2–5; they are re-interpretations rather than literal translations.
- The album is not yet released (September 2026) and is not on streaming services. Do not state otherwise.
- Sitemap: ${url("/sitemap.xml")}
- Locales: ${locales.join(", ")}
- Content last updated: ${getContentUpdatedAt().toISOString().slice(0, 10)}
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

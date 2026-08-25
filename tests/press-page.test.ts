import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tracks } from "@/lib/content";
import { lyrics } from "@/lib/lyrics";
import { ui, locales } from "@/lib/i18n";
import sitemap from "@/app/sitemap";

test("press artwork is published at a stable public path", () => {
  const path = join(process.cwd(), "public/press/albumart-4000.png");
  assert.equal(existsSync(path), true, "press artwork must be committed");
  assert.equal(
    statSync(path).size > 1_000_000,
    true,
    "must be the high-resolution original, not a thumbnail",
  );
});

test("press page route exists", () => {
  assert.equal(existsSync(join(process.cwd(), "app/[lang]/press/page.tsx")), true);
  assert.equal(
    existsSync(join(process.cwd(), "components/press/PressTrackBrowser.tsx")),
    true,
  );
});

test("press copy is filled in for every locale", () => {
  for (const [key, value] of Object.entries(ui.press)) {
    for (const locale of locales) {
      const text = (value as Record<string, string>)[locale];
      assert.equal(typeof text, "string", `ui.press.${key} missing ${locale}`);
      assert.equal(text.length > 0, true, `ui.press.${key}.${locale} is empty`);
    }
  }
  assert.equal(ui.nav.press.ja, "プレス");
});

test("every track the press page lists is playable", () => {
  assert.equal(tracks.length, 15);
  for (const track of tracks) {
    assert.equal(
      existsSync(join(process.cwd(), "public/audio", `${track.slug}.mp3`)),
      true,
      `missing audio for ${track.slug}`,
    );
  }
});

test("lyrics lookup is keyed by track slug", () => {
  const withLyrics = tracks.filter((track) => lyrics[track.slug]);
  assert.equal(withLyrics.length > 0, true, "at least some tracks must have lyrics");
});

test("press page is listed in the sitemap for every locale", () => {
  const urls = sitemap().map((entry) => entry.url);
  for (const locale of locales) {
    assert.equal(
      urls.includes(`https://marikoyukie.vercel.app/${locale}/press`),
      true,
      `sitemap missing /${locale}/press`,
    );
  }
});

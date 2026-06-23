import { existsSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";
import { join } from "node:path";

const root = process.cwd();

test("operational content is split into focused source files", () => {
  const expectedFiles = [
    "content/data/site.ts",
    "content/data/links.ts",
    "content/data/album.ts",
    "content/data/tracks.ts",
    "content/data/artists.ts",
    "content/data/events.ts",
    "content/data/gallery.ts",
    "content/data/story.ts",
    "content/lyrics/index.ts",
  ];

  for (const file of expectedFiles) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }
});

test("lyrics have human-editable markdown sources", () => {
  const dir = join(root, "content/lyrics");
  assert.equal(existsSync(dir), true, "content/lyrics should exist");

  const lyricSources = readdirSync(dir).filter((name) => name.endsWith(".ko.md"));
  assert.equal(lyricSources.length, 9);
  assert.ok(
    lyricSources.includes("sarang-ui-suljan.ko.md"),
    "track lyrics should be named by slug",
  );
});

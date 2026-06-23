import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";
import { join } from "node:path";

const root = process.cwd();

test("audio player is split into focused modules behind a compatibility barrel", () => {
  const expectedFiles = [
    "components/audio/AudioContext.tsx",
    "components/audio/AudioPlayerProvider.tsx",
    "components/audio/MiniPlayer.tsx",
    "components/audio/TrackButtons.tsx",
    "components/audio/icons.tsx",
  ];

  for (const file of expectedFiles) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }

  const barrel = readFileSync(join(root, "components/AudioPlayer.tsx"), "utf8");
  assert.equal(barrel.includes("createContext"), false);
  assert.equal(barrel.includes("useState"), false);
});

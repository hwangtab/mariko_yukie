import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

test("press artwork is published at a stable public path", () => {
  const path = join(process.cwd(), "public/press/albumart-4000.png");
  assert.equal(existsSync(path), true, "press artwork must be committed");
  assert.equal(
    statSync(path).size > 1_000_000,
    true,
    "must be the high-resolution original, not a thumbnail",
  );
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanName, isValidEmail, mergeContacts } from "@/scripts/press/lib/contacts";

test("strips markdown emphasis that leaked into names", () => {
  assert.equal(cleanName("**김성환**"), "김성환");
  assert.equal(cleanName("  박동칠 "), "박동칠");
});

test("rejects malformed addresses", () => {
  assert.equal(isValidEmail("a@b.co"), true);
  assert.equal(isValidEmail("no-at-sign"), false);
  assert.equal(isValidEmail("two@@b.co"), false);
  assert.equal(isValidEmail("trailing@b"), false);
});

test("merges the two lists on a lowercased email key", () => {
  const merged = mergeContacts([
    {
      source: "culture",
      rows: [["이름/직함", "이메일", "소속/설명"], ["임진모", "Ohganzi@gmail.com", "중앙일보"]],
    },
    {
      source: "music",
      rows: [["성명/조직", "역할/소속", "이메일"], ["임진모", "대중음악 평론가", "ohganzi@gmail.com"]],
    },
  ]);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].email, "Ohganzi@gmail.com", "keeps the first-seen casing for delivery");
  assert.deepEqual(merged[0].sources.sort(), ["culture", "music"]);
  assert.equal(merged[0].role.includes("중앙일보"), true);
  assert.equal(merged[0].role.includes("대중음악 평론가"), true);
});

test("does not duplicate identical role text when merging", () => {
  const merged = mergeContacts([
    { source: "a", rows: [["이름/직함", "이메일", "소속/설명"], ["김", "k@x.com", "문화부"]] },
    { source: "b", rows: [["성명/조직", "역할/소속", "이메일"], ["김", "문화부", "k@x.com"]] },
  ]);
  assert.equal(merged[0].role, "문화부");
});

test("drops rows with no usable address", () => {
  const merged = mergeContacts([
    {
      source: "a",
      rows: [["이름/직함", "이메일", "소속/설명"], ["빈행", "", ""], ["좋은행", "ok@x.com", ""]],
    },
  ]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].email, "ok@x.com");
});

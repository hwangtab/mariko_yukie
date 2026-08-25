import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeName, sameNameGroups } from "@/scripts/press/lib/duplicates";

const contact = (name: string, email: string) => ({
  email,
  name,
  role: "",
  roleBySource: {},
  sources: ["music"],
});

test("normalizes away parentheses, spaces and emphasis", () => {
  assert.equal(normalizeName("이진우 (코코플레이 대표)"), "이진우");
  assert.equal(normalizeName("**김성환**"), "김성환");
  assert.equal(normalizeName("Do Heon Kim"), "doheonkim");
});

test("groups the same person across different addresses", () => {
  const groups = sameNameGroups([
    contact("임진모", "ohganzi@gmail.com"),
    contact("임진모", "wan-doll@hanmail.net"),
    contact("김윤하", "soup_mori@naver.com"),
  ]);
  assert.equal(groups.size, 1);
  assert.deepEqual(groups.get("임진모"), ["ohganzi@gmail.com", "wan-doll@hanmail.net"]);
});

test("does not group placeholder names", () => {
  const groups = sameNameGroups([
    contact("-", "a@x.com"),
    contact("-", "b@x.com"),
    contact("", "c@x.com"),
    contact("", "d@x.com"),
  ]);
  assert.equal(groups.size, 0);
});

test("reports organization rows too — a human decides whether they are one contact", () => {
  // 한국대중음악학회 두 행은 일반 문의와 국제회원 담당으로 실제로 다른 사람이다.
  const groups = sameNameGroups([
    contact("한국대중음악학회(KASPM)", "kaspmnet@gmail.com"),
    contact("한국대중음악학회(KASPM)", "groovewon.lee@gmail.com"),
  ]);
  assert.equal(groups.size, 1, "flagged, not auto-merged");
});

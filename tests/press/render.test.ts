import assert from "node:assert/strict";
import { test } from "node:test";
import { findUnsourcedClaims, renderEmail, type Recipient } from "@/scripts/press/lib/render";

const 임진모: Recipient = {
  email: "ohganzi@gmail.com",
  name: "임진모",
  role: "중앙일보 / 대중음악 평론가, 오간지프로덕션 소속 강연자",
  roleBySource: { culture: "중앙일보", music: "대중음악 평론가, 오간지프로덕션 소속 강연자" },
  sources: ["culture", "music"],
  segment: "critic",
  opener: "대중음악 평론을 오래 해오신 임진모 선생님께 음반 한 장을 보냅니다.",
};

test("allows an opener grounded in the music list's role text", () => {
  assert.deepEqual(findUnsourcedClaims(임진모.opener, 임진모), []);
});

test("blocks a fabricated reference to past writing", () => {
  assert.equal(findUnsourcedClaims("지난번 쓰신 기사를 인상 깊게 읽었습니다.", 임진모).length > 0, true);
});

test("blocks claims of a prior relationship", () => {
  assert.equal(findUnsourcedClaims("전에 뵈었을 때 말씀 주신 대로", 임진모).length > 0, true);
  assert.equal(findUnsourcedClaims("오랜만에 인사드립니다.", 임진모).length > 0, true);
});

test("blocks promises we cannot keep", () => {
  assert.equal(findUnsourcedClaims("독점 인터뷰를 약속드립니다.", 임진모).length > 0, true);
});

test("blocks an outlet the address contradicts", () => {
  // 문화부 리스트가 붙여 놓은 "중앙일보"는 이름·주소와 무관한 나열이다.
  const claims = findUnsourcedClaims("중앙일보에 오래 글을 써 오신 임진모 선생님께", 임진모);
  assert.equal(claims.length > 0, true);
  assert.equal(claims.some((claim) => claim.includes("중앙일보")), true);
});

test("allows an outlet the address confirms", () => {
  const 김도헌: Recipient = {
    email: "doheon@izm.co.kr",
    name: "Do Heon Kim",
    role: "한국경제 / 음악 비평/기자 (IZM 편집장)",
    roleBySource: { culture: "한국경제", music: "음악 비평/기자 (IZM 편집장)" },
    sources: ["culture", "music"],
    segment: "critic",
    opener: "IZM 편집장님께 새 음반 한 장을 보냅니다.",
  };
  assert.deepEqual(findUnsourcedClaims(김도헌.opener, 김도헌), []);
});

test("renders text and html carrying the press link", () => {
  const out = renderEmail({
    recipient: 임진모,
    pressUrl: "https://marikoyukie.vercel.app/ko/press",
  });

  assert.equal(out.html.includes("https://marikoyukie.vercel.app/ko/press"), true);
  assert.equal(out.text.includes("https://marikoyukie.vercel.app/ko/press"), true);
  assert.equal(out.html.includes("2026년 9월 4일"), true);
  assert.equal(out.html.includes("텀블벅"), false, "funding is over — never mention it");
  assert.equal(out.subject.length > 0, true);
});

test("escapes html special characters coming from the opener", () => {
  const out = renderEmail({
    recipient: { ...임진모, opener: "<script>alert(1)</script>" },
    pressUrl: "https://example.org/press",
  });
  assert.equal(out.html.includes("<script>"), false);
  assert.equal(out.html.includes("&lt;script&gt;"), true);
});

test("throws when the opener is empty", () => {
  assert.throws(() =>
    renderEmail({ recipient: { ...임진모, opener: "   " }, pressUrl: "https://example.org/press" }),
  );
});

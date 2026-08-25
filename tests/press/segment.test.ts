import assert from "node:assert/strict";
import { test } from "node:test";
import { classify, isOrganizationInbox } from "@/scripts/press/lib/segment";

const contact = (email: string, name = "", role = "", sources = ["culture"]) => ({
  email,
  name,
  role,
  sources,
});

test("editorial inboxes with a music signal stay in the wave", () => {
  // 작은 음악 매체에게 editor@·press@·contact@는 대표함이 아니라 유일한 창구다.
  assert.equal(
    classify(contact("contact@rollingstonekorea.co.kr", "Rolling Stone Korea", "음악 기자/편집자", ["music"])),
    "music-press",
  );
  assert.equal(classify(contact("press@hiphopplaya.com", "HipHopPlaya", "인디 힙합 기자/보도", ["music"])), "music-press");
  assert.equal(classify(contact("info@zandari.com", "Zandari Festa", "인디 음악 페스티벌", ["music"])), "music-press");
  assert.equal(classify(contact("editor@sisain.co.kr", "배순탁", "음악평론가, 시사IN 편집부", ["music"])), "critic");
});

test("editorial inboxes without a music signal are generic-desk", () => {
  assert.equal(classify(contact("editor@example.com", "편집부", "일반 문의")), "generic-desk");
});

test("organization inboxes are flagged so the opener addresses the outlet", () => {
  assert.equal(isOrganizationInbox(contact("press@hiphopplaya.com")), true);
  assert.equal(isOrganizationInbox(contact("ohganzi@gmail.com")), false);
});

test("infrastructure inboxes are generic-desk regardless of description", () => {
  assert.equal(classify(contact("jebo@chosun.com", "제보팀", "조선일보 - 문화·예술 제보")), "generic-desk");
  assert.equal(classify(contact("culture@joongang.co.kr", "문화부", "중앙일보 - 문화 데스크")), "generic-desk");
  assert.equal(classify(contact("webmaster@korea.net", "Webmaster", "K-드라마 OST 및 인디 음악 리포터", ["music"])), "generic-desk");
  assert.equal(classify(contact("hotline@donga.com", "핫라인", "동아일보")), "generic-desk");
  assert.equal(classify(contact("ad@hankookilbo.com", "AD전략본부", "한국일보")), "generic-desk");
});

test("popular-music critics are critic", () => {
  assert.equal(classify(contact("ohganzi@gmail.com", "임진모", "중앙일보 / 대중음악 평론가")), "critic");
  assert.equal(
    classify(contact("ssaemimi@gmail.com", "신샘이", "ears mag 편집장, 대중음악 평론가, 한국대중음악상 선정위원")),
    "critic",
  );
  assert.equal(classify(contact("nolan96@naver.com", "coloringCYAN", "Writer (온음)")), "critic");
});

test("visual-art press is separated out, never critic", () => {
  assert.equal(classify(contact("theartro@gokams.or.kr", "아트로", "THE ARTRO - 현대미술 웹진")), "art-press");
  assert.equal(
    classify(contact("hyi@artinculture.kr", "이현 (편집장)", "ART IN CULTURE - 현대미술 편집장")),
    "art-press",
  );
});

test("membership in the music list is enough when the role is just an outlet name", () => {
  // 원본 역할 칸이 매체명뿐이라 문자열로는 음악인지 알 수 없는 실제 행들.
  assert.equal(classify(contact("noisepop@hanmail.net", "김작가", "noise", ["music"])), "music-press");
  assert.equal(classify(contact("studiocarrot@naver.com", "김학선", "bo-da", ["music"])), "music-press");
  assert.equal(classify(contact("moribe@hanmail.net", "권석정", "10asia", ["music"])), "music-press");
  assert.equal(classify(contact("100beat.com@gmail.com", "백비트", "100beat.com", ["music"])), "music-press");
});

test("the music list does not override an explicit critic signal", () => {
  assert.equal(
    classify(contact("ohganzi@gmail.com", "임진모", "대중음악 평론가", ["music"])),
    "critic",
  );
});

test("music beat reporters and bodies are music-press", () => {
  assert.equal(classify(contact("kaspmnet@gmail.com", "한국대중음악학회(KASPM)", "일반 문의")), "music-press");
  assert.equal(classify(contact("x@y.com", "홍길동", "인디음악 페스티벌 담당")), "music-press");
});

test("individual culture reporters are culture-desk", () => {
  assert.equal(classify(contact("kim@hani.co.kr", "김기자", "한겨레 - 문화부 기자")), "culture-desk");
});

test("culture-list rows with no usable role are unknown", () => {
  assert.equal(classify(contact("someone@ipharmnews.com", "", "")), "unknown");
});

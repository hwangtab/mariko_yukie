import assert from "node:assert/strict";
import { test } from "node:test";
import {
  album,
  artists,
  campaignPhase,
  events,
  getArtist,
  getSiteUrl,
  getTrack,
  siteConfig,
  trackAudio,
  tracks,
} from "@/lib/content";
import { lyrics } from "@/lib/lyrics";

test("content barrel preserves the public content API", () => {
  assert.equal(tracks.length, 15);
  assert.equal(artists.length, 2);
  assert.equal(events.some((event) => event.status === "confirmed"), true);
  assert.equal(getTrack("namsan-tower")?.isTitle, true);
  assert.equal(getArtist("mariko")?.roman, "Trot MARIKO");
});

test("track audio paths are derived from every track slug", () => {
  for (const track of tracks) {
    assert.equal(trackAudio[track.slug], `/audio/${track.slug}.mp3`);
  }
});

test("lyrics are parsed from markdown sources by slug", () => {
  assert.equal(lyrics["sarang-ui-suljan"][0][0], "은혼식을 축하하기 위해서 프렌치 코스 예약완료");
  assert.equal(lyrics["sarang-ui-suljan-ja"][0][0], "銀婚式のお祝いに フレンチコースを予約済み");
  assert.equal(lyrics["namsan-tower"][0].length > 0, true);
});

test("site config centralizes campaign phase and URL generation", () => {
  assert.equal(siteConfig.campaignPhase, campaignPhase);
  assert.equal(campaignPhase, "preRelease");
  assert.equal(getSiteUrl("/ko/album"), "https://marikoyukie.vercel.app/ko/album");
});

test("release date is pinned to 2026-09-04 across locales", () => {
  assert.equal(album.releaseLabel.ko, "2026년 9월 4일 발매");
  assert.equal(album.releaseLabel.ja, "2026年9月4日リリース");
  assert.equal(album.releaseLabel.en, "Out September 4, 2026");

  const releaseRow = album.spec.find((row) => row.label.en === "Release");
  assert.ok(releaseRow, "spec must contain a Release row");
  assert.equal(releaseRow.value.ko, "2026년 9월 4일");
  assert.equal(releaseRow.value.ja, "2026年9月4日");
  assert.equal(releaseRow.value.en, "September 4, 2026");
});

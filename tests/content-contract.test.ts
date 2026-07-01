import assert from "node:assert/strict";
import { test } from "node:test";
import {
  artists,
  campaignPhase,
  events,
  getArtist,
  getSiteUrl,
  getTrack,
  links,
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
  assert.equal(campaignPhase, "funding");
  assert.equal(getSiteUrl("/ko/album"), "https://marikoyukie.vercel.app/ko/album");
  assert.equal(links.tumblbug.length > 0, true);
});

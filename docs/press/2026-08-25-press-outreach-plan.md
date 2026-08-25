# 언론·평론가 아웃리치 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 《남산타워》 발매일(2026-09-04)을 사이트에 반영하고 기자용 프레스 페이지를 띄운 뒤, 평론가·기자 210명에게 개인화 메일을 6일에 걸쳐 안전하게 발송한다.

**Architecture:** 두 부분이다. Part 1은 기존 Next.js 사이트 수정(발매일·국면 전환·`/[lang]/press` 신설)이고, 배포까지 끝나야 Part 2가 시작될 수 있다. Part 2는 `scripts/press/`의 CLI 파이프라인 — CSV 수집·정규화 → 세그먼트 분류 → 개인화 도입부 → HTML 렌더 → Resend 발송. 각 단계는 `private/`에 파일을 남기고, 다음 단계는 그 파일만 읽는다. 발송은 로그 기반으로 재개 가능하다.

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · `node --test` + `tsx` · Resend HTTP API(의존성 추가 없이 `fetch`)

**Spec:** [docs/press/2026-08-25-press-outreach-design.md](./2026-08-25-press-outreach-design.md)

## Global Constraints

- 발매일은 **2026년 9월 4일**. 발매 기념공연은 **2026년 9월 6일**(기존 확정 정보, 변경 금지).
- 텀블벅 펀딩은 **종료**됐다. 사이트 어디에서도 후원을 유도하지 않는다.
- From: `마리코 & 유키에 <noreply@alf.seoul.kr>` / Reply-To: `hwangtab@gmail.com`
- Resend API 키는 alf 레포의 `RESEND_API_KEY`를 이 레포 `.env.local`로 복사해 쓴다. `.env.*`는 이미 gitignore.
- **수신자 데이터(`private/`)는 절대 커밋하지 않는다.**
- `docs/유통자료/`와 `/music/`은 내부 자산이다. 프레스 페이지에는 재킷 4000px 원본 사본만 `public/press/`로 공개한다. **음원 마스터는 어떤 경로로도 공개하지 않는다** — 재생은 `public/audio/`의 192k 스트리밍본으로만.
- 메일 개인화 도입부는 **원본 CSV의 이름·역할·소속 문자열에 있는 것만** 근거로 쓴다. 지어낸 구체성(예: "지난번 쓰신 OO 기사")은 렌더 단계가 발송을 막는다.
- 첨부파일 0. 모든 자료는 프레스 페이지 링크로 보낸다.
- 테스트는 `pnpm test`(`node --import tsx --test "tests/**/*.test.ts"`). 전체 검증은 `pnpm check`.
- 언어는 한국어(`ko`)·일본어(`ja`)·영어(`en`) 3종. 새 UI 문자열은 반드시 3종 다 채운다.

---

## File Structure

**Part 1 — 사이트**

| 파일 | 책임 |
|---|---|
| `content/data/album.ts` (수정) | 발매일 문자열의 단일 출처 |
| `content/data/site.ts` (수정) | `campaignPhase` 전환 |
| `components/CTABlock.tsx` (수정) | 펀딩 종료 후 CTA 분기 |
| `lib/i18n.ts` (수정) | `nav.press` 추가, 깨진 `cta.support.ja` 정리 |
| `app/llms.txt/route.ts` (수정) | AI 대상 사실 진술에서 펀딩 제거·발매일 명시 |
| `public/press/albumart-4000.png` (신규) | 기자 배포용 고해상 재킷 |
| `app/[lang]/press/page.tsx` (신규) | 프레스 페이지 서버 컴포넌트 — 데이터 조립·메타데이터 |
| `components/press/PressTrackBrowser.tsx` (신규) | 클라이언트 — 트랙 선택·재생·가사 동시 표시 |
| `app/sitemap.ts` (수정) | `/press` 등록 |
| `components/Header.tsx` (수정) | 네비에 프레스 추가 |
| `tests/content-contract.test.ts` (수정) | 국면·발매일 계약 갱신 |
| `tests/press-page.test.ts` (신규) | 프레스 페이지 계약 |

**Part 2 — 아웃리치 파이프라인**

| 파일 | 책임 |
|---|---|
| `.gitignore` (수정) | `private/` 제외 |
| `scripts/press/lib/csv.ts` (신규) | CSV 파싱·직렬화. 순수 함수 |
| `scripts/press/lib/contacts.ts` (신규) | 두 리스트 병합·정규화·중복 제거. 순수 함수 |
| `scripts/press/lib/segment.ts` (신규) | 역할 문자열 → 세그먼트 분류. 순수 함수 |
| `scripts/press/lib/render.ts` (신규) | 메일 HTML/텍스트 생성 + 근거 없는 고유명사 검사 |
| `scripts/press/lib/transport.ts` (신규) | Resend HTTP 호출. I/O 경계 |
| `scripts/press/ingest.ts` (신규) | CLI — CSV → `private/contacts.json` |
| `scripts/press/segment.ts` (신규) | CLI — 분류 + 검수용 CSV 출력 |
| `scripts/press/render.ts` (신규) | CLI — 프리뷰 HTML 생성 |
| `scripts/press/send.ts` (신규) | CLI — 드라이런/테스트/발송/재개 |
| `tests/press/*.test.ts` (신규) | 위 순수 함수들의 테스트 |

순수 로직(`lib/`)과 I/O(CLI, `transport.ts`)를 분리한다. 발송 로직에 테스트를 붙일 수 없으면 리허설 없이 210명에게 쏘게 된다.

---

# Part 1 — 사이트 선행 작업

## Task 1: 발매일 2026-09-04 반영

**Files:**
- Modify: `content/data/album.ts:11-15`, `content/data/album.ts:63`
- Modify: `app/llms.txt/route.ts:64`, `app/llms.txt/route.ts:128`
- Test: `tests/content-contract.test.ts`

**Interfaces:**
- Consumes: 없음 (첫 작업)
- Produces: `album.releaseLabel` / `album.spec`의 발매 행이 9월 4일을 담는다. 이후 모든 페이지와 프레스 페이지가 이 값을 읽는다.

- [ ] **Step 1: 발매일 계약 테스트를 추가한다 (실패하는 상태로)**

`tests/content-contract.test.ts` 끝에 추가:

```typescript
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
```

파일 상단 import에 `album`이 없으면 `@/lib/content` 목록에 추가한다.

- [ ] **Step 2: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — `'2026년 9월 발매 예정' !== '2026년 9월 4일 발매'`

- [ ] **Step 3: `content/data/album.ts`의 발매 문자열을 고친다**

`releaseLabel`(11-15행):

```typescript
  releaseLabel: {
    ko: "2026년 9월 4일 발매",
    ja: "2026年9月4日リリース",
    en: "Out September 4, 2026",
  } as Localized,
```

`spec` 배열의 발매 행(63행):

```typescript
    { label: { ko: "발매", ja: "リリース", en: "Release" }, value: { ko: "2026년 9월 4일", ja: "2026年9月4日", en: "September 4, 2026" } },
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: `app/llms.txt/route.ts`의 사실 진술을 고친다**

64행 — 펀딩 문구를 제거하고 날짜를 명시한다:

```typescript
> ${album.concept.en} A 15-track album by Mariko (a Japanese trot singer based in Seoul) and Sato Yukie (a Japanese rock musician who has lived in Seoul since 1995), releasing September 4, 2026.
```

128행:

```typescript
- The album is not yet released (releases September 4, 2026) and is not on streaming services. Do not state otherwise.
```

118행의 `- Crowdfunding (Tumblbug): ${links.tumblbug}` 줄은 통째로 삭제한다. 펀딩이 끝났는데 AI에게 후원 링크를 알려줄 이유가 없다.

- [ ] **Step 6: 타입체크와 빌드를 돌린다**

Run: `pnpm typecheck && pnpm build`
Expected: 성공. `links` import가 `llms.txt/route.ts`에서 더 이상 쓰이지 않으면 lint가 잡으므로, 미사용이면 import에서 제거한다.

- [ ] **Step 7: 커밋**

```bash
git add content/data/album.ts app/llms.txt/route.ts tests/content-contract.test.ts
git commit -m "발매일 2026년 9월 4일을 사이트 전체에 반영"
```

---

## Task 2: 펀딩 종료 반영 — 국면 전환과 CTA 정리

**Files:**
- Modify: `content/data/site.ts:4`
- Modify: `components/CTABlock.tsx`
- Modify: `lib/i18n.ts` (`ui.cta`)
- Test: `tests/content-contract.test.ts:36-42`

**Interfaces:**
- Consumes: Task 1의 `album.releaseLabel`
- Produces: `campaignPhase === "preRelease"`. `CTABlock`이 더 이상 텀블벅으로 유도하지 않고 앨범·공연으로 보낸다.

- [ ] **Step 1: 국면 계약 테스트를 고친다**

`tests/content-contract.test.ts`의 기존 테스트(36-42행)를 교체한다. 현재는 `campaignPhase`가 `"funding"`이고 텀블벅 링크가 있다고 단언하고 있어, 고치지 않으면 Step 3에서 깨진다.

```typescript
test("site config centralizes campaign phase and URL generation", () => {
  assert.equal(siteConfig.campaignPhase, campaignPhase);
  assert.equal(campaignPhase, "preRelease");
  assert.equal(getSiteUrl("/ko/album"), "https://marikoyukie.vercel.app/ko/album");
});
```

`links.tumblbug`에 대한 단언은 삭제한다. 펀딩이 끝났으므로 링크 존재가 더는 계약이 아니다.

- [ ] **Step 2: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — `'funding' !== 'preRelease'`

- [ ] **Step 3: `content/data/site.ts`의 국면을 전환한다**

4행:

```typescript
export const campaignPhase: SitePhase = "preRelease";
```

- [ ] **Step 4: 테스트 통과를 확인한다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: `CTABlock`의 문구와 분기를 발매 전 상황으로 바꾼다**

지금 헤드라인은 "이 음반을 세상에 내보내는 힘은 당신의 후원입니다."로 후원을 전제한다. 펀딩이 끝났으니 발매 예고로 바꾼다. `components/CTABlock.tsx`의 컴포넌트 본문을 다음으로 교체한다 (import와 장식 요소는 그대로 둔다):

```typescript
export default function CTABlock({ locale }: { locale: Locale }) {
  const isFunding = campaignPhase === "funding";
  const hasTumblbug = isFunding && links.tumblbug.length > 0;
  const hasStreaming = Object.values(links.streaming).some(Boolean);

  return (
    <section className="night relative overflow-hidden">
      <div aria-hidden className="halftone-light pointer-events-none absolute inset-0 opacity-20" />
      <Star size={28} className="twinkle absolute left-[12%] top-12 text-yellow" />
      <Star size={18} className="twinkle-2 absolute right-[18%] top-20 text-pink" />
      <Star size={22} className="twinkle absolute bottom-16 right-[12%] text-blue" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 text-center md:px-8">
        <p className="pixel text-xs uppercase tracking-[0.2em] text-yellow">
          2026 · Namsan Tower Lights
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl text-balance font-display text-3xl leading-tight outline-navy-thin md:text-5xl">
          {hasTumblbug
            ? tri(
                locale,
                "이 음반을 세상에 내보내는 힘은 당신의 후원입니다.",
                "このアルバムを世に出す力は、あなたの応援です。",
                "The power to bring this album into the world is your support.",
              )
            : tri(
                locale,
                "2026년 9월 4일, 《남산타워》가 나옵니다.",
                "2026年9月4日、『南山タワー』が届きます。",
                "September 4, 2026 — Namsan Tower Lights arrives.",
              )}
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {hasTumblbug ? (
            <a
              href={links.tumblbug}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker sticker-coral rounded-full bg-coral px-8 py-3.5 font-display text-base text-cream transition hover:-translate-y-1 hover:bg-coral-deep"
            >
              {ui.cta.support[locale]} ↗
            </a>
          ) : (
            <Link
              href={`/${locale}/album`}
              className="sticker sticker-coral rounded-full bg-coral px-8 py-3.5 font-display text-base text-cream transition hover:-translate-y-1 hover:bg-coral-deep"
            >
              {hasStreaming ? ui.cta.listen[locale] : ui.nav.album[locale]} →
            </Link>
          )}

          <Link
            href={`/${locale}/live`}
            className="rounded-full border-2 border-cream/80 px-8 py-3.5 font-display text-base text-cream transition hover:-translate-y-1 hover:bg-cream hover:text-night"
          >
            {ui.nav.live[locale]} →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

`hasTumblbug` 분기를 지우지 않고 남기는 이유: `campaignPhase`는 4개 국면을 오가는 스위치이고, 나중에 다른 펀딩을 열 수 있다. 죽은 코드가 아니라 국면 스위치의 한쪽 날개다.

- [ ] **Step 6: 깨진 일본어 문자열을 고친다**

`lib/i18n.ts` 41행의 `ui.cta.support.ja`가 `"텀블벅で応援する"`로, 한국어 단어가 일본어 문장에 박혀 있다. 일본 기자도 받는 사이트다.

```typescript
    support: { ko: "텀블벅에서 후원하기", ja: "テンブルバグで応援する", en: "Back us on Tumblbug" },
```

- [ ] **Step 7: 전체 검증**

Run: `pnpm check`
Expected: 테스트·타입·lint·빌드 전부 통과

- [ ] **Step 8: 개발 서버로 눈으로 확인한다**

Run: `pnpm dev` 후 브라우저에서 `http://localhost:3000/ko/album`, `/ja/album`, `/en/album` 하단 CTA 확인.
Expected: 텀블벅 버튼이 사라지고 앨범·공연 버튼이 보인다. 일본어 화면에 한국어가 섞여 있지 않다.

- [ ] **Step 9: 커밋**

```bash
git add content/data/site.ts components/CTABlock.tsx lib/i18n.ts tests/content-contract.test.ts
git commit -m "펀딩 종료를 반영해 발매 전 국면으로 전환"
```

---

## Task 3: 기자 배포용 고해상 재킷 공개

**Files:**
- Create: `public/press/albumart-4000.png`
- Test: `tests/press-page.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces: `/press/albumart-4000.png` 정적 경로. Task 4의 프레스 페이지가 이 경로로 다운로드 링크를 건다.

- [ ] **Step 1: 원본을 공개 경로로 복사한다**

`docs/유통자료/`는 gitignore된 내부 폴더다. 기자에게 줄 재킷만 의도적으로 꺼낸다.

```bash
mkdir -p public/press
cp "docs/유통자료/Albumart_4000px.png" public/press/albumart-4000.png
ls -lh public/press/albumart-4000.png
```

Expected: 약 9.7MB 파일이 생성된다.

- [ ] **Step 2: 자산 존재 테스트를 쓴다**

`tests/press-page.test.ts` 신규 생성:

```typescript
import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

test("press artwork is published at a stable public path", () => {
  const path = join(process.cwd(), "public/press/albumart-4000.png");
  assert.equal(existsSync(path), true, "press artwork must be committed");
  assert.equal(statSync(path).size > 1_000_000, true, "must be the high-resolution original, not a thumbnail");
});
```

- [ ] **Step 3: 테스트를 돌린다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 4: 음원 마스터가 딸려오지 않았는지 확인한다**

```bash
git status --short public/press/
```

Expected: `public/press/albumart-4000.png` 한 줄만. `.mp3`·`.wav`·`.aif`가 보이면 즉시 삭제한다.

- [ ] **Step 5: 커밋**

```bash
git add public/press/albumart-4000.png tests/press-page.test.ts
git commit -m "기자 배포용 4000px 재킷을 공개 경로에 추가"
```

---

## Task 4: 프레스 페이지 — 전곡 재생과 가사 동시 표시

**Files:**
- Create: `components/press/PressTrackBrowser.tsx`
- Create: `app/[lang]/press/page.tsx`
- Modify: `lib/i18n.ts` (`ui.nav.press`, `ui.press.*`)
- Test: `tests/press-page.test.ts` (Task 3에서 생성한 파일에 추가)

**Interfaces:**
- Consumes: `tracks`, `album`, `links`, `images` (`@/lib/content`) · `lyrics` (`@/lib/lyrics`) · `useAudio()`가 돌려주는 `AudioController`(`activeSlug`, `playing`, `playSlug`) · `TrackPlayButton` (`@/components/audio/TrackButtons`) · `buildPageMetadata` (`@/lib/metadata`)
- Produces: `/{locale}/press` 라우트. `PressTrackBrowser`는 `{ locale: Locale; items: PressTrackItem[] }`를 받는다. `PressTrackItem = { slug: string; number: number; title: string; type: string; lyrics: string[][] | null }`

- [ ] **Step 1: UI 문자열을 3개 언어로 추가한다**

`lib/i18n.ts`의 `ui.nav`에 추가:

```typescript
    press: { ko: "프레스", ja: "プレス", en: "Press" },
```

`ui` 객체에 새 섹션을 추가한다:

```typescript
  press: {
    heading: { ko: "프레스킷", ja: "プレスキット", en: "Press Kit" },
    intro: {
      ko: "취재에 필요한 자료를 한곳에 모았습니다. 전곡을 이 페이지에서 바로 들으실 수 있습니다.",
      ja: "取材に必要な資料をまとめました。全曲をこのページで直接お聴きいただけます。",
      en: "Everything you need to cover the album, in one place. Every track streams right here.",
    },
    selectTrack: { ko: "트랙을 선택하면 재생되고 가사가 함께 표시됩니다.", ja: "トラックを選ぶと再生され、歌詞が一緒に表示されます。", en: "Pick a track to play it and read its lyrics alongside." },
    lyricsPending: { ko: "이 곡의 가사는 아직 공개 전입니다.", ja: "この曲の歌詞は未公開です。", en: "Lyrics for this track are not yet published." },
    artwork: { ko: "고해상 재킷 내려받기 (4000px)", ja: "高解像度ジャケットをダウンロード (4000px)", en: "Download high-resolution artwork (4000px)" },
    watchMV: { ko: "뮤직비디오 보기", ja: "ミュージックビデオを見る", en: "Watch the music video" },
    contact: { ko: "취재 문의", ja: "取材のお問い合わせ", en: "Press inquiries" },
  },
```

- [ ] **Step 2: 프레스 페이지 계약 테스트를 쓴다 (실패하는 상태로)**

`tests/press-page.test.ts`에 추가:

```typescript
import { tracks } from "@/lib/content";
import { lyrics } from "@/lib/lyrics";
import { ui } from "@/lib/i18n";

test("press page route exists", () => {
  assert.equal(existsSync(join(process.cwd(), "app/[lang]/press/page.tsx")), true);
  assert.equal(existsSync(join(process.cwd(), "components/press/PressTrackBrowser.tsx")), true);
});

test("press copy is filled in for every locale", () => {
  for (const value of Object.values(ui.press)) {
    for (const locale of ["ko", "ja", "en"] as const) {
      assert.equal(typeof value[locale], "string");
      assert.equal(value[locale].length > 0, true, `ui.press missing ${locale}`);
    }
  }
  assert.equal(ui.nav.press.ja, "プレス");
});

test("every track the press page lists is playable", () => {
  assert.equal(tracks.length, 15);
  for (const track of tracks) {
    assert.equal(existsSync(join(process.cwd(), "public/audio", `${track.slug}.mp3`)), true, `missing audio for ${track.slug}`);
  }
});

test("lyrics lookup is keyed by track slug", () => {
  const withLyrics = tracks.filter((track) => lyrics[track.slug]);
  assert.equal(withLyrics.length > 0, true, "at least some tracks must have lyrics");
});
```

- [ ] **Step 3: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — `app/[lang]/press/page.tsx` 없음

- [ ] **Step 4: `PressTrackBrowser` 클라이언트 컴포넌트를 만든다**

`components/press/PressTrackBrowser.tsx` 신규 생성. 기존 오디오 시스템의 `useAudio()`를 그대로 쓴다 — 재생 상태는 이미 `AudioPlayerProvider`가 레이아웃에서 관리하므로 새로 만들지 않는다. 이 컴포넌트가 더하는 것은 **선택된 트랙의 가사를 옆에 띄우는 것**뿐이다.

```tsx
"use client";

import { useState } from "react";
import { useAudio } from "@/components/audio/AudioContext";
import { TrackPlayButton } from "@/components/audio/TrackButtons";
import { ui, type Locale } from "@/lib/i18n";

export type PressTrackItem = {
  slug: string;
  number: number;
  title: string;
  type: string;
  lyrics: string[][] | null;
};

export default function PressTrackBrowser({
  locale,
  items,
}: {
  locale: Locale;
  items: PressTrackItem[];
}) {
  const { activeSlug, playSlug } = useAudio();
  const [selected, setSelected] = useState<string>(items[0]?.slug ?? "");

  // 재생 중인 트랙이 있으면 그쪽 가사를 보여준다. 없으면 마지막으로 고른 트랙.
  const shownSlug = activeSlug ?? selected;
  const shown = items.find((item) => item.slug === shownSlug) ?? items[0];

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <ol className="overflow-hidden rounded-card border-2 border-navy">
        {items.map((item, i) => {
          const isShown = item.slug === shownSlug;
          return (
            <li
              key={item.slug}
              className={`${i % 2 === 0 ? "bg-cream" : "bg-cream-deep/60"} ${isShown ? "bg-yellow/30" : ""}`}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <TrackPlayButton slug={item.slug} />
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item.slug);
                    playSlug(item.slug);
                  }}
                  className="flex flex-1 items-baseline gap-3 text-left"
                >
                  <span className="pixel w-8 text-sm text-coral-deep">
                    {String(item.number).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-heading text-lg text-navy">{item.title}</span>
                  <span className="hidden text-xs text-navy/50 sm:inline">{item.type}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="rounded-card border-2 border-navy bg-cream p-6">
        <p className="pixel text-xs uppercase tracking-[0.2em] text-coral-deep">
          {String(shown.number).padStart(2, "0")} · {shown.title}
        </p>
        {shown.lyrics ? (
          <div className="mt-5 space-y-5">
            {shown.lyrics.map((stanza, si) => (
              <p key={si} className="whitespace-pre-line leading-relaxed text-navy">
                {stanza.join("\n")}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-navy/60">{ui.press.lyricsPending[locale]}</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 프레스 페이지 서버 컴포넌트를 만든다**

`app/[lang]/press/page.tsx` 신규 생성. 다른 페이지(`app/[lang]/lyrics/page.tsx`)와 동일한 패턴 — `generateMetadata` + `notFound()` 가드 + 서버에서 데이터 조립.

```tsx
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, tri, ui, type Locale } from "@/lib/i18n";
import { album, images, links, tracks } from "@/lib/content";
import { lyrics } from "@/lib/lyrics";
import { buildPageMetadata } from "@/lib/metadata";
import { SectionLabel, Star } from "@/components/ui";
import PressTrackBrowser, { type PressTrackItem } from "@/components/press/PressTrackBrowser";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return buildPageMetadata({
    locale: loc,
    path: "/press",
    title: `${ui.press.heading[loc]} — ${album.title[loc]}`,
    description: ui.press.intro[loc],
  });
}

export default async function PressPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const items: PressTrackItem[] = tracks.map((track) => ({
    slug: track.slug,
    number: track.number,
    title: track.title[locale],
    type: track.type[locale],
    lyrics: lyrics[track.slug] ?? null,
  }));

  return (
    <>
      <section className="night relative overflow-hidden">
        <Star size={22} className="twinkle absolute right-[14%] top-14 text-yellow" />
        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-24 md:px-8">
          <SectionLabel tone="cream">Press</SectionLabel>
          <h1 className="mt-5 font-display text-5xl text-yellow text-shadow-pop md:text-6xl">
            {ui.press.heading[locale]}
          </h1>
          <p className="mt-4 max-w-2xl text-cream/80">{ui.press.intro[locale]}</p>
          <p className="mt-2 font-heading text-lg text-cream">{album.releaseLabel[locale]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        <dl className="grid gap-4 sm:grid-cols-2">
          {album.spec.map((row) => (
            <div key={row.label.en} className="rounded-card border-2 border-navy bg-cream px-4 py-3">
              <dt className="pixel text-[10px] uppercase tracking-[0.15em] text-coral-deep">
                {row.label[locale]}
              </dt>
              <dd className="mt-1 font-heading text-navy">{row.value[locale]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-14 md:px-8">
        <p className="mb-5 text-navy/70">{ui.press.selectTrack[locale]}</p>
        <PressTrackBrowser locale={locale} items={items} />
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24 md:px-8">
        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <Image
            src={images.cover}
            alt={`${album.title[locale]} ${album.titleRoman}`}
            width={640}
            height={640}
            sizes="220px"
            className="sticker w-full rounded-card"
          />
          <ul className="space-y-3 self-center">
            <li>
              <a
                href="/press/albumart-4000.png"
                download
                className="font-heading text-lg text-coral-deep underline decoration-2 underline-offset-4 hover:text-coral"
              >
                {ui.press.artwork[locale]} ↓
              </a>
            </li>
            <li>
              <a
                href={`https://www.youtube.com/watch?v=${links.musicVideoYoutubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-lg text-coral-deep underline decoration-2 underline-offset-4 hover:text-coral"
              >
                {ui.press.watchMV[locale]} ↗
              </a>
            </li>
            <li>
              <a
                href={`mailto:${links.contactEmail}`}
                className="font-heading text-lg text-coral-deep underline decoration-2 underline-offset-4 hover:text-coral"
              >
                {ui.press.contact[locale]}: {links.contactEmail}
              </a>
            </li>
            <li className="pt-2 text-sm text-navy/60">
              {tri(
                locale,
                "수록곡 해설과 전체 가사는 앨범·가사 페이지에서 보실 수 있습니다.",
                "収録曲の解説と全歌詞は、アルバム・歌詞ページでご覧いただけます。",
                "Track notes and full lyrics are on the album and lyrics pages.",
              )}
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 6: 테스트가 통과하는지 확인한다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 7: 실제 화면을 확인한다**

Run: `pnpm dev` 후 `http://localhost:3000/ko/press`
Expected 체크리스트:
- 트랙 15개가 모두 보인다
- 아무 트랙이나 눌러 재생되고, 하단 MiniPlayer가 뜬다
- 재생 중인 트랙의 가사가 오른쪽에 바로 표시된다
- 가사가 없는 트랙은 "아직 공개 전" 문구가 뜨고 깨지지 않는다
- 재킷 다운로드 링크를 눌러 4000px 파일이 받아진다
- `/ja/press`, `/en/press`도 동일하게 동작하고 언어가 섞이지 않는다

- [ ] **Step 8: 전체 검증**

Run: `pnpm check`
Expected: 전부 통과

- [ ] **Step 9: 커밋**

```bash
git add app/\[lang\]/press components/press lib/i18n.ts tests/press-page.test.ts
git commit -m "프레스 페이지 신설 — 전곡 인라인 재생과 가사 동시 표시"
```

---

## Task 5: 프레스 페이지를 사이트 구조에 등록

**Files:**
- Modify: `app/sitemap.ts:8`
- Modify: `components/Header.tsx`
- Modify: `app/llms.txt/route.ts`
- Test: `tests/press-page.test.ts`

**Interfaces:**
- Consumes: Task 4의 `/press` 라우트와 `ui.nav.press`
- Produces: 없음 (마무리 작업)

- [ ] **Step 1: 사이트맵 계약 테스트를 추가한다**

`tests/press-page.test.ts`에 추가:

```typescript
import sitemap from "@/app/sitemap";

test("press page is listed in the sitemap for every locale", () => {
  const urls = sitemap().map((entry) => entry.url);
  for (const locale of ["ko", "ja", "en"]) {
    assert.equal(
      urls.includes(`https://marikoyukie.vercel.app/${locale}/press`),
      true,
      `sitemap missing /${locale}/press`,
    );
  }
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — `/ko/press` 없음

- [ ] **Step 3: 사이트맵에 등록한다**

`app/sitemap.ts` 8행의 `staticPaths` 끝에 `"/press"`를 더한다:

```typescript
  const staticPaths = ["", "/artists", "/album", "/video", "/gallery", "/lyrics", "/live", "/about", "/press"];
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: 헤더 네비에 추가한다**

`components/Header.tsx`를 열어 네비 항목 배열을 찾는다. 다른 항목이 `{ href: \`/${locale}/lyrics\`, label: ui.nav.lyrics[locale] }` 형태라면 같은 모양으로 press 항목을 **마지막에** 추가한다. 프레스는 일반 방문자용이 아니므로 앞자리를 차지하면 안 된다.

파일의 실제 구조를 먼저 읽고 그 패턴에 맞춘다. 배열 리터럴이 없고 JSX가 나열돼 있다면 마지막 `<Link>` 뒤에 같은 클래스명으로 하나 더 넣는다.

- [ ] **Step 6: llms.txt에 프레스 페이지를 알린다**

`app/llms.txt/route.ts`의 페이지 목록 부분에 프레스 페이지 한 줄을 더한다. 형식은 파일 안의 기존 줄을 그대로 따른다. 예:

```
- Press kit (audio, artwork, credits): ${getSiteUrl("/ko/press")}
```

- [ ] **Step 7: 전체 검증과 눈 확인**

Run: `pnpm check`
Expected: 통과

Run: `pnpm dev` → 헤더에서 프레스 링크를 눌러 이동되는지 확인. 모바일 폭(375px)에서 네비가 깨지지 않는지 확인.

- [ ] **Step 8: 커밋**

```bash
git add app/sitemap.ts components/Header.tsx app/llms.txt/route.ts tests/press-page.test.ts
git commit -m "프레스 페이지를 네비·사이트맵·llms.txt에 등록"
```

---

## Task 6: 배포와 실물 검증

**Files:** 없음 (배포 작업)

**Interfaces:**
- Consumes: Task 1-5 전부
- Produces: 공개 URL `https://<배포도메인>/ko/press`. Part 2의 메일이 이 주소를 링크한다. **이 태스크가 끝나기 전에는 메일을 한 통도 보내지 않는다.**

- [ ] **Step 1: 푸시하고 배포를 기다린다**

```bash
git push
```

- [ ] **Step 2: 배포된 프레스 페이지가 실제로 200을 주는지 확인한다**

```bash
BASE=https://marikoyukie.vercel.app
for p in /ko/press /ja/press /en/press /press/albumart-4000.png; do
  printf "%s -> " "$p"
  curl -s -o /dev/null -w "%{http_code}\n" "$BASE$p"
done
```

Expected: 전부 `200`. 하나라도 아니면 Part 2로 넘어가지 않는다.

- [ ] **Step 3: 배포본에서 음원 재생을 확인한다**

브라우저로 `$BASE/ko/press`를 열어 트랙 하나를 재생한다. 로컬이 아니라 **배포본**에서 소리가 나야 한다.

- [ ] **Step 4: 텀블벅 잔재가 없는지 확인한다**

```bash
curl -s "$BASE/llms.txt" | grep -i "tumblbug\|crowdfund" || echo "정리됨"
```

Expected: `정리됨`

---

# Part 2 — 아웃리치 파이프라인

## Task 7: 작업 기반 — private 격리와 CSV 파서

**Files:**
- Modify: `.gitignore`
- Create: `scripts/press/lib/csv.ts`
- Test: `tests/press/csv.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces: `parseCsv(text: string): string[][]` — 헤더 포함 전체 행. `toCsv(rows: string[][]): string` — 쉼표·따옴표·줄바꿈을 RFC 4180으로 이스케이프.

- [ ] **Step 1: `private/`를 gitignore에 추가한다**

이것이 이 파트의 1번 작업이다. 기자 400명의 개인 이메일이 공개 레포에 들어가면 사고다. `.gitignore`의 "로컬/에이전트 작업 산출물" 블록 아래에 추가한다:

```
# 언론 아웃리치 수신자 데이터·발송 로그(개인정보, 공개 금지)
private/
```

- [ ] **Step 2: 격리가 실제로 되는지 확인한다**

```bash
mkdir -p private && echo "test@example.com" > private/canary.txt
git status --short private/
```

Expected: 출력 없음. 뭔가 나오면 gitignore가 안 먹은 것이므로 진행하지 않는다.

```bash
rm private/canary.txt
```

- [ ] **Step 3: CSV 파서 테스트를 쓴다**

`tests/press/csv.test.ts` 신규 생성. 실제 리스트에 따옴표 안 쉼표가 들어 있다 — "대중음악 평론가, 한국대중음악상 선정위원" 같은 값이다. 단순 `split(",")`는 여기서 무너진다.

```typescript
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCsv, toCsv } from "@/scripts/press/lib/csv";

test("parses plain rows", () => {
  assert.deepEqual(parseCsv("a,b\n1,2"), [["a", "b"], ["1", "2"]]);
});

test("keeps commas inside quoted fields", () => {
  assert.deepEqual(
    parseCsv('name,role\n임진모,"대중음악 평론가, 선정위원"'),
    [["name", "role"], ["임진모", "대중음악 평론가, 선정위원"]],
  );
});

test("unescapes doubled quotes", () => {
  assert.deepEqual(parseCsv('a\n"he said ""hi"""'), [["a"], ['he said "hi"']]);
});

test("handles newlines inside quoted fields", () => {
  assert.deepEqual(parseCsv('a,b\n"line1\nline2",x'), [["a", "b"], ["line1\nline2", "x"]]);
});

test("ignores a trailing newline", () => {
  assert.deepEqual(parseCsv("a,b\n1,2\n"), [["a", "b"], ["1", "2"]]);
});

test("strips a UTF-8 BOM", () => {
  assert.deepEqual(parseCsv("﻿a,b\n1,2"), [["a", "b"], ["1", "2"]]);
});

test("round-trips values that need escaping", () => {
  const rows = [["name", "role"], ["임진모", '평론가, "선정위원"']];
  assert.deepEqual(parseCsv(toCsv(rows)), rows);
});
```

- [ ] **Step 4: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — 모듈 없음

- [ ] **Step 5: `tsconfig.json`의 경로 별칭이 `scripts/`를 포함하는지 확인하고, 아니면 넓힌다**

```bash
grep -n '"paths"' -A5 tsconfig.json
grep -n '"include"' -A5 tsconfig.json
```

`"@/*": ["./*"]`이면 그대로 쓸 수 있다. `include`에 `scripts`가 빠져 있으면 배열에 `"scripts/**/*.ts"`를 추가한다.

- [ ] **Step 6: 파서를 구현한다**

`scripts/press/lib/csv.ts` 신규 생성:

```typescript
/**
 * RFC 4180 CSV 파서.
 *
 * 기자 리스트의 역할 필드에는 "대중음악 평론가, 한국대중음악상 선정위원"처럼
 * 따옴표 안에 쉼표가 들어 있다. split(",")로 자르면 열이 밀려 엉뚱한 사람에게
 * 엉뚱한 개인화 문장이 붙는다.
 */
export function parseCsv(text: string): string[][] {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export function toCsv(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((value) =>
          /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value,
        )
        .join(","),
    )
    .join("\n");
}
```

- [ ] **Step 7: 테스트 통과를 확인한다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 8: 커밋**

```bash
git add .gitignore scripts/press/lib/csv.ts tests/press/csv.test.ts
git commit -m "아웃리치 기반 — private 격리와 RFC 4180 CSV 파서"
```

---

## Task 8: 수신자 병합·정규화 (ingest)

**Files:**
- Create: `scripts/press/lib/contacts.ts`
- Create: `scripts/press/ingest.ts`
- Test: `tests/press/contacts.test.ts`

**Interfaces:**
- Consumes: `parseCsv` (Task 7)
- Produces:
  - `type Contact = { email: string; name: string; role: string; sources: string[] }`
  - `cleanName(raw: string): string`
  - `isValidEmail(value: string): boolean`
  - `mergeContacts(inputs: { source: string; rows: string[][] }[]): Contact[]`
  - CLI가 `private/contacts.json`에 `Contact[]`를 쓴다. Task 9가 이 파일을 읽는다.

- [ ] **Step 1: 정규화 테스트를 쓴다**

`tests/press/contacts.test.ts` 신규 생성. 실제 리스트에서 확인된 오염을 그대로 케이스로 삼는다.

```typescript
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
    { source: "culture", rows: [["이름/직함", "이메일", "소속/설명"], ["임진모", "Ohganzi@gmail.com", "중앙일보"]] },
    { source: "music", rows: [["성명/조직", "역할/소속", "이메일"], ["임진모", "대중음악 평론가", "ohganzi@gmail.com"]] },
  ]);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].email, "Ohganzi@gmail.com", "keeps the first-seen original casing for delivery");
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
    { source: "a", rows: [["이름/직함", "이메일", "소속/설명"], ["빈행", "", ""], ["좋은행", "ok@x.com", ""]] },
  ]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].email, "ok@x.com");
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: `contacts.ts`를 구현한다**

두 CSV의 열 순서가 다르다. 문화부 리스트는 `이름/직함, 이메일, 소속/설명`이고 음악 리스트는 `성명/조직, 역할/소속, 이메일`이다. 헤더 이름으로 열을 찾아야 하는 이유다.

`scripts/press/lib/contacts.ts` 신규 생성:

```typescript
export type Contact = {
  email: string;
  name: string;
  role: string;
  sources: string[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** 리스트에 마크다운 강조(**이름**)와 앞뒤 공백이 섞여 들어와 있다. */
export function cleanName(raw: string): string {
  return raw.replace(/\*+/g, "").replace(/\s+/g, " ").trim();
}

function columnIndex(header: string[], candidates: string[]): number {
  return header.findIndex((cell) => candidates.includes(cell.trim()));
}

export function mergeContacts(
  inputs: { source: string; rows: string[][] }[],
): Contact[] {
  const byKey = new Map<string, Contact>();

  for (const { source, rows } of inputs) {
    if (rows.length === 0) continue;
    const header = rows[0];
    const nameCol = columnIndex(header, ["이름/직함", "성명/조직"]);
    const emailCol = columnIndex(header, ["이메일"]);
    const roleCol = columnIndex(header, ["소속/설명", "역할/소속"]);

    for (const row of rows.slice(1)) {
      const email = (row[emailCol] ?? "").trim();
      if (!isValidEmail(email)) continue;

      const key = email.toLowerCase();
      const name = cleanName(row[nameCol] ?? "");
      const role = cleanName(row[roleCol] ?? "");
      const existing = byKey.get(key);

      if (!existing) {
        // 발송에는 처음 본 원본 표기를 그대로 쓴다. 키만 소문자다.
        byKey.set(key, { email, name, role, sources: [source] });
        continue;
      }

      if (!existing.name) existing.name = name;
      if (role && !existing.role.includes(role)) {
        existing.role = existing.role ? `${existing.role} / ${role}` : role;
      }
      if (!existing.sources.includes(source)) existing.sources.push(source);
    }
  }

  return [...byKey.values()];
}
```

- [ ] **Step 4: 테스트 통과를 확인한다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: CLI를 만든다**

`scripts/press/ingest.ts` 신규 생성:

```typescript
/**
 * 사용법:
 *   pnpm tsx scripts/press/ingest.ts <문화부CSV> <음악CSV>
 *
 * 산출물: private/contacts.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parseCsv } from "./lib/csv";
import { mergeContacts } from "./lib/contacts";

const [culturePath, musicPath] = process.argv.slice(2);
if (!culturePath || !musicPath) {
  console.error("사용법: pnpm tsx scripts/press/ingest.ts <문화부CSV> <음악CSV>");
  process.exit(1);
}

const contacts = mergeContacts([
  { source: "culture", rows: parseCsv(readFileSync(culturePath, "utf8")) },
  { source: "music", rows: parseCsv(readFileSync(musicPath, "utf8")) },
]);

mkdirSync(join(process.cwd(), "private"), { recursive: true });
const out = join(process.cwd(), "private/contacts.json");
writeFileSync(out, JSON.stringify(contacts, null, 2), "utf8");

const bothLists = contacts.filter((c) => c.sources.length > 1).length;
console.log(`고유 수신자 ${contacts.length}명 (두 리스트 중복 ${bothLists}명)`);
console.log(`→ ${out}`);
```

- [ ] **Step 6: 실제 CSV로 돌려 숫자를 확인한다**

```bash
pnpm tsx scripts/press/ingest.ts \
  ~/Downloads/"문화부_사회부 기자 리스트 - 시트1.csv" \
  ~/Downloads/"음악 관계자, 기자, 평론가 이메일 주소 - 대중음악웹진 온음_tonpleincontact@gmail.com__Writer_color....csv"
```

Expected: `고유 수신자 417명 (두 리스트 중복 25명)`. 숫자가 크게 다르면 열 매칭이 어긋난 것이므로 헤더를 다시 확인한다.

- [ ] **Step 7: 산출물이 커밋 대상이 아닌지 확인한다**

```bash
git status --short
```

Expected: `private/contacts.json`이 보이지 않는다.

- [ ] **Step 8: 커밋**

```bash
git add scripts/press/lib/contacts.ts scripts/press/ingest.ts tests/press/contacts.test.ts
git commit -m "수신자 CSV 병합·정규화 파이프라인"
```

---

## Task 9: 세그먼트 분류와 검수용 CSV

**Files:**
- Create: `scripts/press/lib/segment.ts`
- Create: `scripts/press/segment.ts`
- Test: `tests/press/segment.test.ts`

**Interfaces:**
- Consumes: `Contact` (Task 8), `toCsv` (Task 7)
- Produces:
  - `type Segment = "critic" | "music-press" | "culture-desk" | "generic-desk" | "unknown"`
  - `classify(contact: Contact): Segment`
  - `WAVE_ONE: Segment[]` = `["critic", "music-press", "culture-desk"]`
  - CLI가 `private/segments.csv`(검수용, 열: `segment,name,role,email,include`)를 쓴다. Task 12가 `include` 열이 `y`인 행만 발송 대상으로 삼는다.

- [ ] **Step 1: 분류 테스트를 쓴다**

실제 데이터에서 확인된 케이스를 그대로 쓴다. 특히 현대미술 웹진이 `critic`으로 새는 것을 막는 케이스가 핵심이다 — 미술 매체에 대중음악 앨범을 보내면 그냥 스팸이다.

`tests/press/segment.test.ts` 신규 생성:

```typescript
import assert from "node:assert/strict";
import { test } from "node:test";
import { classify } from "@/scripts/press/lib/segment";

const contact = (email: string, name = "", role = "") => ({ email, name, role, sources: ["x"] });

test("department inboxes are generic-desk regardless of description", () => {
  assert.equal(classify(contact("jebo@chosun.com", "제보팀", "조선일보 - 문화·예술 제보")), "generic-desk");
  assert.equal(classify(contact("culture@joongang.co.kr", "문화부", "중앙일보 - 문화 데스크")), "generic-desk");
  assert.equal(classify(contact("hotline@donga.com", "핫라인", "동아일보")), "generic-desk");
  assert.equal(classify(contact("ad@hankookilbo.com", "AD전략본부", "한국일보")), "generic-desk");
});

test("popular-music critics are critic", () => {
  assert.equal(classify(contact("ohganzi@gmail.com", "임진모", "중앙일보 / 대중음악 평론가")), "critic");
  assert.equal(classify(contact("ssaemimi@gmail.com", "신샘이", "ears mag 편집장, 대중음악 평론가, 한국대중음악상 선정위원")), "critic");
  assert.equal(classify(contact("nolan96@naver.com", "coloringCYAN", "Writer (온음)")), "critic");
});

test("visual-art press never lands in critic", () => {
  assert.equal(classify(contact("theartro@gokams.or.kr", "아트로", "THE ARTRO - 현대미술 웹진")), "unknown");
  assert.equal(classify(contact("hyi@artinculture.kr", "이현 (편집장)", "ART IN CULTURE - 현대미술 편집장")), "unknown");
});

test("music beat reporters and bodies are music-press", () => {
  assert.equal(classify(contact("kaspmnet@gmail.com", "한국대중음악학회(KASPM)", "일반 문의")), "music-press");
  assert.equal(classify(contact("x@y.com", "홍길동", "인디음악 페스티벌 담당")), "music-press");
});

test("individual culture reporters are culture-desk", () => {
  assert.equal(classify(contact("kim@hani.co.kr", "김기자", "한겨레 - 문화부 기자")), "culture-desk");
});

test("rows with no usable role are unknown", () => {
  assert.equal(classify(contact("hj50ka@ipharmnews.com", "강희종", "")), "unknown");
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 분류기를 구현한다**

순서가 규칙이다. 부서 대표함 판정이 가장 먼저고, 미술 배제가 음악 판정보다 먼저다.

`scripts/press/lib/segment.ts` 신규 생성:

```typescript
import type { Contact } from "./contacts";

export type Segment =
  | "critic"
  | "music-press"
  | "culture-desk"
  | "generic-desk"
  | "unknown";

/** 1차 발송 대상 세그먼트. 우선순위 순서이기도 하다. */
export const WAVE_ONE: Segment[] = ["critic", "music-press", "culture-desk"];

const DEPARTMENT_INBOX =
  /^(jebo|hotline|contents?|ad|press|news\d*|desk|culture|society|economy|editor|info|write|contact|webmaster|help|mail|newsroom|onlinenews)@/i;

/** 현대미술·시각예술 매체. 대중음악 앨범을 보내면 스팸이다. */
const VISUAL_ART = /현대미술|시각예술|미술\s*웹진|ART IN CULTURE|THE ARTRO|아트로|갤러리|큐레이터/i;

const MUSIC_CRITIC =
  /대중음악\s*평론|음악\s*평론|평론가|선정위원|한국대중음악상|음악\s*저널리스트|온음|weiv|izm|ears\s*mag|Writer\s*\(온음\)/i;

const MUSIC_BEAT =
  /대중음악|음악|인디|페스티벌|K-?pop|케이팝|밴드|레이블|앨범|재즈|아이돌|음반|공연\s*담당/i;

const CULTURE_BEAT = /문화|예술|공연|영화|방송|연예/i;

export function classify(contact: Contact): Segment {
  const local = contact.email.split("@")[0];
  if (DEPARTMENT_INBOX.test(`${local}@`)) return "generic-desk";

  const blob = `${contact.name} ${contact.role}`.trim();
  if (!blob) return "unknown";

  // 미술 매체는 음악 판정보다 먼저 걸러낸다. "미술 평론가"가 critic으로 새면 안 된다.
  if (VISUAL_ART.test(blob)) return "unknown";

  if (MUSIC_CRITIC.test(blob)) return "critic";
  if (MUSIC_BEAT.test(blob)) return "music-press";
  if (CULTURE_BEAT.test(blob)) return "culture-desk";
  return "unknown";
}
```

- [ ] **Step 4: 테스트 통과를 확인한다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: 검수용 CSV를 뽑는 CLI를 만든다**

`scripts/press/segment.ts` 신규 생성:

```typescript
/**
 * 사용법:
 *   pnpm tsx scripts/press/segment.ts
 *
 * 입력: private/contacts.json
 * 산출물: private/segments.csv  — 스프레드시트로 열어 눈으로 검수한다.
 *         include 열이 y인 행만 실제 발송 대상이 된다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { toCsv } from "./lib/csv";
import type { Contact } from "./lib/contacts";
import { classify, WAVE_ONE } from "./lib/segment";

const contacts: Contact[] = JSON.parse(
  readFileSync(join(process.cwd(), "private/contacts.json"), "utf8"),
);

const tagged = contacts
  .map((contact) => ({ contact, segment: classify(contact) }))
  .sort((a, b) => {
    const order = ["critic", "music-press", "culture-desk", "generic-desk", "unknown"];
    return order.indexOf(a.segment) - order.indexOf(b.segment);
  });

const rows = [
  ["segment", "name", "role", "email", "include"],
  ...tagged.map(({ contact, segment }) => [
    segment,
    contact.name,
    contact.role,
    contact.email,
    WAVE_ONE.includes(segment) ? "y" : "n",
  ]),
];

const out = join(process.cwd(), "private/segments.csv");
writeFileSync(out, toCsv(rows), "utf8");

const counts = new Map<string, number>();
for (const { segment } of tagged) counts.set(segment, (counts.get(segment) ?? 0) + 1);
for (const [segment, count] of counts) console.log(`${segment.padEnd(14)} ${count}`);
console.log(`\n1차 대상(include=y): ${rows.slice(1).filter((r) => r[4] === "y").length}명`);
console.log(`→ ${out}`);
console.log("스프레드시트로 열어 include 열을 손보세요. 이 검수가 유일한 오발송 방어선입니다.");
```

- [ ] **Step 6: 실제 데이터로 돌린다**

Run: `pnpm tsx scripts/press/segment.ts`
Expected: 다섯 세그먼트의 건수가 출력되고, 1차 대상이 대략 200명대로 나온다. 스펙의 210명과 정확히 같을 필요는 없다 — 미술 배제 규칙이 몇 명을 `unknown`으로 옮기기 때문이다.

- [ ] **Step 7: `private/segments.csv`를 눈으로 검수한다**

스프레드시트로 열어 `critic`과 `music-press` 전 행을 훑는다. 확인할 것:
- 대중음악과 무관한 매체가 섞여 있지 않은가 → `include`를 `n`으로
- 소속과 이메일 도메인이 명백히 어긋난 행(예: 소속 서울경제 · 주소 `@imbc.com`) → `n`
- 실재가 의심되는 도메인(예: `@novel.com`) → `n`
- `culture-desk` 108명도 전원 1차이므로 같은 기준으로 훑는다

- [ ] **Step 8: 커밋**

```bash
git add scripts/press/lib/segment.ts scripts/press/segment.ts tests/press/segment.test.ts
git commit -m "세그먼트 분류기와 검수용 CSV 출력"
```

---

## Task 10: 메일 렌더링과 근거 없는 개인화 차단

**Files:**
- Create: `scripts/press/lib/render.ts`
- Create: `scripts/press/render.ts`
- Test: `tests/press/render.test.ts`

**Interfaces:**
- Consumes: `Contact` (Task 8), `Segment` (Task 9)
- Produces:
  - `type Recipient = Contact & { segment: Segment; opener: string }`
  - `findUnsourcedClaims(opener: string, contact: Contact): string[]` — 근거 없는 주장 문구를 돌려준다. 빈 배열이면 통과.
  - `renderEmail(input: { recipient: Recipient; pressUrl: string }): { subject: string; html: string; text: string }`
  - `SUBJECTS: Record<"A" | "B", string>`

- [ ] **Step 1: 렌더링과 차단 테스트를 쓴다**

`tests/press/render.test.ts` 신규 생성:

```typescript
import assert from "node:assert/strict";
import { test } from "node:test";
import { findUnsourcedClaims, renderEmail } from "@/scripts/press/lib/render";

const base = {
  email: "critic@example.org",
  name: "임진모",
  role: "중앙일보 / 대중음악 평론가",
  sources: ["music"],
  segment: "critic" as const,
};

test("allows an opener grounded in the recorded role", () => {
  assert.deepEqual(
    findUnsourcedClaims("대중음악 평론을 오래 해오신 임진모 선생님께 음반 한 장을 보냅니다.", base),
    [],
  );
});

test("blocks a fabricated reference to past writing", () => {
  const claims = findUnsourcedClaims("지난번 쓰신 기사를 인상 깊게 읽었습니다.", base);
  assert.equal(claims.length > 0, true);
});

test("blocks claims of a prior relationship", () => {
  assert.equal(findUnsourcedClaims("전에 뵈었을 때 말씀 주신 대로", base).length > 0, true);
  assert.equal(findUnsourcedClaims("오랜만에 인사드립니다.", base).length > 0, true);
});

test("blocks review promises we cannot make", () => {
  assert.equal(findUnsourcedClaims("독점 인터뷰를 약속드립니다.", base).length > 0, true);
});

test("renders both plain text and html with the press link", () => {
  const out = renderEmail({
    recipient: { ...base, opener: "대중음악 평론을 오래 해오신 분께 음반을 보냅니다." },
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
    recipient: { ...base, opener: "<script>alert(1)</script>" },
    pressUrl: "https://example.org/press",
  });
  assert.equal(out.html.includes("<script>"), false);
  assert.equal(out.html.includes("&lt;script&gt;"), true);
});

test("throws when the opener is empty", () => {
  assert.throws(() =>
    renderEmail({ recipient: { ...base, opener: "   " }, pressUrl: "https://example.org/press" }),
  );
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 렌더러와 검사기를 구현한다**

`scripts/press/lib/render.ts` 신규 생성:

```typescript
import type { Contact } from "./contacts";
import type { Segment } from "./segment";

export type Recipient = Contact & { segment: Segment; opener: string };

export const FROM = "마리코 & 유키에 <noreply@alf.seoul.kr>";
export const REPLY_TO = "hwangtab@gmail.com";

export const SUBJECTS = {
  A: "일본인 둘이 서울에서 만든 한국어 앨범 《남산타워》 — 9월 4일 발매",
  B: "《남산타워》 앨범 소개 — 마리코 & 유키에 (한국어 10곡, 일본어 5곡)",
} as const;

/**
 * 근거 없는 개인화를 막는다.
 *
 * 평론가 바닥은 좁아서, 지어낸 문장 하나가 하루면 돈다. 도입부는 리스트에 적힌
 * 역할·소속만 근거로 삼아야 하므로, 관계나 과거 행위를 주장하는 표현을 통째로 금지한다.
 * 화이트리스트가 아니라 블랙리스트인 이유는 문장 형태가 다양해 열거가 불가능하기 때문이다.
 */
const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  { pattern: /지난번|지난\s*기사|전에\s*쓰신|쓰신\s*(글|기사|리뷰)|읽었습니다|읽어보았|보았습니다/, why: "과거 저작물을 읽었다는 주장" },
  { pattern: /뵈었을|뵀을|만나뵈|인사드린\s*적|오랜만|다시\s*연락|전에\s*연락/, why: "기존 관계 주장" },
  { pattern: /약속드립니다|독점|단독\s*제공|보장/, why: "지킬 수 없는 약속" },
  { pattern: /팬입니다|애독|늘\s*챙겨\s*보/, why: "확인 불가능한 친밀감 주장" },
];

export function findUnsourcedClaims(opener: string, contact: Contact): string[] {
  const found: string[] = [];
  for (const { pattern, why } of FORBIDDEN) {
    const match = opener.match(pattern);
    if (match) found.push(`${why}: "${match[0]}"`);
  }
  // 이름·역할에 없는 매체명을 지어냈는지까지는 정규식으로 잡을 수 없다.
  // 그래서 openers.csv 사람 검수가 두 번째 방어선으로 반드시 필요하다.
  void contact;
  return found;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

const WHY_IT_MATTERS: Record<Segment, string> = {
  critic:
    "1960~70년대 그룹 사운드를 몸으로 통과한 사토유키에와 트로트 가수 마리코가, 서울에 살면서 한국어로 만든 음반입니다. 한일 문화교류의 역방향이라 할 만한 자리에 있고, 두 언어가 번역이 아니라 각각의 원본으로 존재합니다. 「사랑의 술잔」의 \"여보여보\"처럼 한국어와 일본어에서 동시에 작동하는 가사가 그 증거입니다.",
  "music-press":
    "서울에 사는 일본인 두 사람이 한국어로 만든 15트랙 음반입니다. 9월 4일 발매하고 9월 6일에 발매 기념공연이 있습니다. 관광객의 시선이 아니라 서울이 이미 집이 된 사람들의 시선이라, 남산타워가 명소가 아니라 동네 랜드마크로 등장합니다.",
  "culture-desk":
    "서울에 사는 일본인 두 사람이 한국어로 만든 15트랙 음반입니다. 9월 4일 발매하고 9월 6일에 발매 기념공연이 있습니다. 한일 문화교류를 늘 이야기하지만 이 방향의 사례는 드뭅니다.",
  "generic-desk":
    "서울에 사는 일본인 두 사람이 한국어로 만든 15트랙 음반이 9월 4일 발매됩니다.",
  unknown:
    "서울에 사는 일본인 두 사람이 한국어로 만든 15트랙 음반이 9월 4일 발매됩니다.",
};

const FACTS = [
  "앨범 《남산타워》 (Namsan Tower Lights)",
  "마리코 & 유키에 — 15트랙 (한국어 10곡, 일본어 5곡)",
  "2026년 9월 4일 발매 · CD 500장 한정 + 디지털",
  "9월 6일(일) 오후 5시 발매 기념공연 — 스페이스 한강(서울)",
];

export function renderEmail({
  recipient,
  pressUrl,
}: {
  recipient: Recipient;
  pressUrl: string;
}): { subject: string; html: string; text: string } {
  const opener = recipient.opener.trim();
  if (!opener) throw new Error(`opener is empty for ${recipient.email}`);

  const why = WHY_IT_MATTERS[recipient.segment];
  const subject = SUBJECTS.A;

  const text = [
    opener,
    "",
    why,
    "",
    ...FACTS.map((fact) => `· ${fact}`),
    "",
    `전곡 듣기 · 가사 · 고해상 재킷 · 크레딧 — 아래 한 페이지에 모아두었습니다.`,
    pressUrl,
    "",
    "필요하신 자료가 더 있으면 이 메일에 그대로 회신해 주세요.",
    "",
    "마리코 & 유키에",
    "수신을 원치 않으시면 이 메일에 회신해 주시면 됩니다.",
  ].join("\n");

  const html = `<div style="font-family:${FONT};max-width:600px;margin:0 auto;color:#1a1a1a;font-size:15px;line-height:1.8;">
  <p style="margin:0 0 18px;">${esc(opener).replace(/\n/g, "<br>")}</p>
  <p style="margin:0 0 18px;">${esc(why)}</p>
  <ul style="margin:0 0 18px;padding-left:18px;">
    ${FACTS.map((fact) => `<li style="margin-bottom:4px;">${esc(fact)}</li>`).join("\n    ")}
  </ul>
  <p style="margin:0 0 8px;">전곡 듣기 · 가사 · 고해상 재킷 · 크레딧을 한 페이지에 모아두었습니다.</p>
  <p style="margin:0 0 24px;">
    <a href="${esc(pressUrl)}" style="color:#c2410c;font-weight:700;">${esc(pressUrl)}</a>
  </p>
  <p style="margin:0 0 24px;">필요하신 자료가 더 있으면 이 메일에 그대로 회신해 주세요.</p>
  <p style="margin:0;color:#111;">마리코 &amp; 유키에</p>
  <p style="margin:16px 0 0;font-size:12px;color:#999;">수신을 원치 않으시면 이 메일에 회신해 주시면 됩니다.</p>
</div>`;

  return { subject, html, text };
}
```

- [ ] **Step 4: 테스트 통과를 확인한다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: 프리뷰 CLI를 만든다**

`scripts/press/render.ts` 신규 생성:

```typescript
/**
 * 사용법:
 *   pnpm tsx scripts/press/render.ts
 *
 * 입력: private/recipients.json (Task 12가 만든다)
 * 산출물: private/preview.html — 브라우저로 열어 실제 생김새를 확인한다.
 *         근거 없는 개인화가 하나라도 있으면 여기서 멈춘다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findUnsourcedClaims, renderEmail, type Recipient } from "./lib/render";

const PRESS_URL = process.env.PRESS_URL ?? "https://marikoyukie.vercel.app/ko/press";

const recipients: Recipient[] = JSON.parse(
  readFileSync(join(process.cwd(), "private/recipients.json"), "utf8"),
);

const problems: string[] = [];
for (const recipient of recipients) {
  for (const claim of findUnsourcedClaims(recipient.opener, recipient)) {
    problems.push(`${recipient.email} — ${claim}`);
  }
}

if (problems.length > 0) {
  console.error(`\n근거 없는 개인화 ${problems.length}건. 발송을 막습니다.\n`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  console.error("\nprivate/openers.csv에서 해당 줄을 고치고 다시 실행하세요.\n");
  process.exit(1);
}

const previews = recipients
  .slice(0, 20)
  .map((recipient) => {
    const { subject, html } = renderEmail({ recipient, pressUrl: PRESS_URL });
    return `<hr><p style="font-family:monospace;background:#f3f4f6;padding:8px;">
      To: ${recipient.email} · ${recipient.segment}<br>Subject: ${subject}</p>${html}`;
  })
  .join("\n");

const out = join(process.cwd(), "private/preview.html");
writeFileSync(out, `<meta charset="utf-8"><body style="background:#fff;">${previews}</body>`, "utf8");
console.log(`검사 통과 — 수신자 ${recipients.length}명`);
console.log(`앞 20통 프리뷰 → ${out}`);
```

- [ ] **Step 6: 커밋**

```bash
git add scripts/press/lib/render.ts scripts/press/render.ts tests/press/render.test.ts
git commit -m "메일 렌더러와 근거 없는 개인화 차단 검사기"
```

---

## Task 11: 발송기 — 스로틀·재개·중단

**Files:**
- Create: `scripts/press/lib/transport.ts`
- Create: `scripts/press/send.ts`
- Test: `tests/press/transport.test.ts`

**Interfaces:**
- Consumes: `renderEmail`, `findUnsourcedClaims`, `FROM`, `REPLY_TO`, `Recipient` (Task 10)
- Produces:
  - `type SendResult = { ok: boolean; id?: string; error?: string }`
  - `sendOne(input: { apiKey: string; to: string; subject: string; html: string; text: string; fetchImpl?: typeof fetch }): Promise<SendResult>`
  - `loadSentAddresses(logPath: string): Set<string>`
  - `private/send-log.jsonl` — 한 줄에 `{ email, ok, id?, error?, at }` 하나

- [ ] **Step 1: 전송 계층 테스트를 쓴다**

실제로 메일을 보내지 않고 검증한다. `fetch`를 주입 가능하게 만드는 이유다 — 그러지 않으면 발송 로직을 리허설 없이 210명에게 처음 실행하게 된다.

`tests/press/transport.test.ts` 신규 생성:

```typescript
import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadSentAddresses, sendOne } from "@/scripts/press/lib/transport";

test("posts to the Resend API with the expected envelope", async () => {
  let captured: { url: string; body: Record<string, unknown>; auth: string } | null = null;

  const fakeFetch = (async (url: string | URL, init?: RequestInit) => {
    captured = {
      url: String(url),
      body: JSON.parse(String(init?.body)),
      auth: String((init?.headers as Record<string, string>)?.Authorization),
    };
    return new Response(JSON.stringify({ id: "abc123" }), { status: 200 });
  }) as unknown as typeof fetch;

  const result = await sendOne({
    apiKey: "re_test",
    to: "a@b.com",
    subject: "제목",
    html: "<p>본문</p>",
    text: "본문",
    fetchImpl: fakeFetch,
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "abc123");
  assert.equal(captured!.url, "https://api.resend.com/emails");
  assert.equal(captured!.auth, "Bearer re_test");
  assert.deepEqual(captured!.body.to, ["a@b.com"]);
  assert.equal(captured!.body.reply_to, "hwangtab@gmail.com");
  assert.equal(String(captured!.body.from).includes("alf.seoul.kr"), true);
});

test("surfaces API errors instead of throwing", async () => {
  const failing = (async () =>
    new Response(JSON.stringify({ message: "domain not verified" }), { status: 403 })) as unknown as typeof fetch;

  const result = await sendOne({
    apiKey: "re_test",
    to: "a@b.com",
    subject: "s",
    html: "h",
    text: "t",
    fetchImpl: failing,
  });

  assert.equal(result.ok, false);
  assert.equal(String(result.error).includes("domain not verified"), true);
});

test("resume set contains only addresses that were delivered", () => {
  const dir = mkdtempSync(join(tmpdir(), "press-"));
  const logPath = join(dir, "send-log.jsonl");
  writeFileSync(
    logPath,
    [
      JSON.stringify({ email: "Sent@X.com", ok: true, id: "1", at: "2026-08-26T00:00:00Z" }),
      JSON.stringify({ email: "failed@x.com", ok: false, error: "boom", at: "2026-08-26T00:00:01Z" }),
    ].join("\n"),
    "utf8",
  );

  const sent = loadSentAddresses(logPath);
  assert.equal(sent.has("sent@x.com"), true, "matching must be case-insensitive");
  assert.equal(sent.has("failed@x.com"), false, "failures must be retryable");
});

test("resume set is empty when no log exists yet", () => {
  const dir = mkdtempSync(join(tmpdir(), "press-"));
  assert.equal(loadSentAddresses(join(dir, "nope.jsonl")).size, 0);
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `pnpm test`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 전송 계층을 구현한다**

`scripts/press/lib/transport.ts` 신규 생성:

```typescript
import { existsSync, readFileSync } from "node:fs";
import { FROM, REPLY_TO } from "./render";

export type SendResult = { ok: boolean; id?: string; error?: string };

const ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 12_000;

export async function sendOne({
  apiKey,
  to,
  subject,
  html,
  text,
  fetchImpl = fetch,
}: {
  apiKey: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  fetchImpl?: typeof fetch;
}): Promise<SendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: REPLY_TO,
        subject,
        html,
        text,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };

    if (!response.ok) {
      return { ok: false, error: payload.message ?? `HTTP ${response.status}` };
    }
    return { ok: true, id: payload.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 이미 배달된 주소의 집합.
 *
 * 중복 발송이 이 일에서 가장 큰 사고다. 같은 기자에게 같은 메일이 두 번 가면
 * 그 사람에게는 스팸이 된다. 실패한 주소는 넣지 않는다 — 재시도해야 하니까.
 */
export function loadSentAddresses(logPath: string): Set<string> {
  if (!existsSync(logPath)) return new Set();

  const sent = new Set<string>();
  for (const line of readFileSync(logPath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line) as { email?: string; ok?: boolean };
      if (entry.ok && entry.email) sent.add(entry.email.toLowerCase());
    } catch {
      // 깨진 줄은 무시한다. 로그가 손상돼도 발송은 이어져야 한다.
    }
  }
  return sent;
}
```

- [ ] **Step 4: 테스트 통과를 확인한다**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 5: 발송 CLI를 만든다**

alf `scripts/send-mailing.js`의 안전 흐름을 그대로 따른다 — 기본값이 드라이런이고, 실제 발송은 `"보내기"`를 직접 타이핑해야 시작된다.

`scripts/press/send.ts` 신규 생성:

```typescript
/**
 * 사용법:
 *   pnpm tsx scripts/press/send.ts                          # 드라이런(발송 안 함)
 *   pnpm tsx scripts/press/send.ts --test <이메일>          # 1통 테스트 발송
 *   pnpm tsx scripts/press/send.ts --send --limit 25        # 실제 발송, 상한 25통
 *   pnpm tsx scripts/press/send.ts --send --segment critic --limit 25
 *
 * 입력: private/recipients.json
 * 로그: private/send-log.jsonl (이미 보낸 주소는 자동으로 건너뛴다)
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { findUnsourcedClaims, renderEmail, type Recipient } from "./lib/render";
import { loadSentAddresses, sendOne } from "./lib/transport";

const DELAY_MS = 600;
const LOG_PATH = join(process.cwd(), "private/send-log.jsonl");
const PRESS_URL = process.env.PRESS_URL ?? "https://marikoyukie.vercel.app/ko/press";

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const mode = args.includes("--send") ? "send" : args.includes("--test") ? "test" : "preview";
const testEmail = flag("--test");
const limit = Number(flag("--limit") ?? Number.POSITIVE_INFINITY);
const segment = flag("--segment");

function loadEnv(): void {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!match) continue;
    const raw = match[2].trim();
    process.env[match[1]] = raw.replace(/^(['"])(.*)\1$/s, "$2");
  }
}

async function verifyPressPage(): Promise<void> {
  // 메일은 배포된 프레스 페이지를 링크한다. 배포 전에 보내면 기자가 404를 만난다.
  const response = await fetch(PRESS_URL, { method: "HEAD" }).catch(() => null);
  if (!response || !response.ok) {
    console.error(`\n발송 중단: 프레스 페이지에 접근할 수 없습니다 — ${PRESS_URL}`);
    console.error("   배포를 먼저 끝내고 다시 실행하세요.\n");
    process.exit(1);
  }
  console.log(`프레스 페이지 확인 ✓ ${PRESS_URL}`);
}

async function main(): Promise<void> {
  loadEnv();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && mode !== "preview") {
    console.error("오류: RESEND_API_KEY가 .env.local에 없습니다 (alf 레포에서 복사)");
    process.exit(1);
  }

  const all: Recipient[] = JSON.parse(
    readFileSync(join(process.cwd(), "private/recipients.json"), "utf8"),
  );

  const problems = all.flatMap((r) =>
    findUnsourcedClaims(r.opener, r).map((claim) => `${r.email} — ${claim}`),
  );
  if (problems.length > 0) {
    console.error(`\n근거 없는 개인화 ${problems.length}건. 발송을 막습니다.`);
    for (const problem of problems) console.error(`  ✗ ${problem}`);
    process.exit(1);
  }

  const sent = loadSentAddresses(LOG_PATH);
  const queue = all
    .filter((r) => !sent.has(r.email.toLowerCase()))
    .filter((r) => !segment || r.segment === segment)
    .slice(0, limit);

  console.log(`\n전체 ${all.length}명 · 발송 완료 ${sent.size}명 · 이번 대상 ${queue.length}명`);
  if (segment) console.log(`세그먼트 필터: ${segment}`);

  if (mode === "preview") {
    for (const recipient of queue.slice(0, 10)) {
      console.log(`  ${recipient.segment.padEnd(13)} ${recipient.email}  ${recipient.name}`);
    }
    if (queue.length > 10) console.log(`  ... 외 ${queue.length - 10}명`);
    console.log("\n실제 발송: --send --limit N   /   테스트 1통: --test <이메일>\n");
    return;
  }

  await verifyPressPage();

  if (mode === "test") {
    const sample = queue[0] ?? all[0];
    const { subject, html, text } = renderEmail({ recipient: sample, pressUrl: PRESS_URL });
    const result = await sendOne({
      apiKey: apiKey!,
      to: testEmail!,
      subject: `[테스트] ${subject}`,
      html,
      text,
      fetchImpl: fetch,
    });
    console.log(result.ok ? `테스트 발송 완료 ✓ ${result.id}` : `실패: ${result.error}`);
    process.exit(result.ok ? 0 : 1);
  }

  console.log(`\n${queue.length}명에게 실제로 발송합니다. 되돌릴 수 없습니다.`);
  console.log('진행하려면 "보내기"를 입력하세요 (취소: 그냥 Enter):');

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise<string>((resolve) => rl.question("> ", (value) => {
    rl.close();
    resolve(value.trim());
  }));
  if (answer !== "보내기") {
    console.log("취소됐습니다.");
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const [i, recipient] of queue.entries()) {
    const { subject, html, text } = renderEmail({ recipient, pressUrl: PRESS_URL });
    process.stdout.write(`  [${i + 1}/${queue.length}] ${recipient.email} ... `);

    const result = await sendOne({
      apiKey: apiKey!,
      to: recipient.email,
      subject,
      html,
      text,
      fetchImpl: fetch,
    });

    appendFileSync(
      LOG_PATH,
      JSON.stringify({
        email: recipient.email,
        segment: recipient.segment,
        ok: result.ok,
        id: result.id,
        error: result.error,
        at: new Date().toISOString(),
      }) + "\n",
      "utf8",
    );

    if (result.ok) {
      ok++;
      console.log("완료 ✓");
    } else {
      fail++;
      console.log(`실패 (${result.error})`);
    }

    if (i < queue.length - 1) await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  console.log(`\n성공 ${ok}건 · 실패 ${fail}건`);
  if (fail > 0) {
    console.log("실패한 주소는 로그에 ok:false로 남아 다음 실행에서 자동 재시도됩니다.");
  }
}

main().catch((error: unknown) => {
  console.error("오류:", error instanceof Error ? error.message : error);
  process.exit(1);
});
```

- [ ] **Step 6: Resend 키를 가져온다**

```bash
grep -m1 '^RESEND_API_KEY=' ~/alf/.env.local >> .env.local
grep -c RESEND_API_KEY .env.local
```

Expected: `1`. 이미 있으면 중복되지 않게 확인한다.

- [ ] **Step 7: `.env.local`이 커밋되지 않는지 확인한다**

```bash
git check-ignore -v .env.local
```

Expected: `.gitignore:...:.env.*  .env.local`

- [ ] **Step 8: 전체 검증**

Run: `pnpm check`
Expected: 통과

- [ ] **Step 9: 커밋**

```bash
git add scripts/press/lib/transport.ts scripts/press/send.ts tests/press/transport.test.ts
git commit -m "Resend 발송기 — 스로틀·재개·발송 전 페이지 검증"
```

---

## Task 12: 개인화 도입부 작성과 검수

**Files:**
- Create: `private/openers.csv` (커밋 안 함)
- Create: `private/recipients.json` (커밋 안 함)
- Create: `scripts/press/build-recipients.ts`
- Test: 없음 (데이터 작업 — 검증은 Task 10의 검사기와 사람 눈)

**Interfaces:**
- Consumes: `private/segments.csv` (Task 9), `Contact`·`Segment`·`Recipient` 타입
- Produces: `private/recipients.json` — `Recipient[]`. Task 11의 `send.ts`가 이 파일만 읽는다.

- [ ] **Step 1: 도입부 작성용 뼈대 CSV를 뽑는다**

`scripts/press/build-recipients.ts` 신규 생성:

```typescript
/**
 * 사용법:
 *   pnpm tsx scripts/press/build-recipients.ts --skeleton   # openers.csv 뼈대 생성
 *   pnpm tsx scripts/press/build-recipients.ts              # openers.csv → recipients.json
 *
 * 뼈대는 segments.csv에서 include=y인 행만 담는다. opener 열은 비어 있고,
 * 사람이(또는 Claude가) 채운 뒤 두 번째 형태로 다시 실행한다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsv, toCsv } from "./lib/csv";
import type { Recipient } from "./lib/render";
import type { Segment } from "./lib/segment";

const root = process.cwd();
const skeleton = process.argv.includes("--skeleton");

const segmentRows = parseCsv(readFileSync(join(root, "private/segments.csv"), "utf8"));
const header = segmentRows[0];
const col = (name: string) => header.indexOf(name);
const included = segmentRows
  .slice(1)
  .filter((row) => row[col("include")].trim().toLowerCase() === "y");

if (skeleton) {
  const rows = [
    ["segment", "name", "role", "email", "opener"],
    ...included.map((row) => [
      row[col("segment")],
      row[col("name")],
      row[col("role")],
      row[col("email")],
      "",
    ]),
  ];
  const out = join(root, "private/openers.csv");
  writeFileSync(out, toCsv(rows), "utf8");
  console.log(`뼈대 ${rows.length - 1}행 → ${out}`);
  console.log("opener 열을 채운 뒤 --skeleton 없이 다시 실행하세요.");
  process.exit(0);
}

const openerRows = parseCsv(readFileSync(join(root, "private/openers.csv"), "utf8"));
const oHeader = openerRows[0];
const oCol = (name: string) => oHeader.indexOf(name);

const recipients: Recipient[] = [];
const missing: string[] = [];

for (const row of openerRows.slice(1)) {
  const opener = row[oCol("opener")].trim();
  const email = row[oCol("email")].trim();
  if (!opener) {
    missing.push(email);
    continue;
  }
  recipients.push({
    email,
    name: row[oCol("name")].trim(),
    role: row[oCol("role")].trim(),
    sources: [],
    segment: row[oCol("segment")].trim() as Segment,
    opener,
  });
}

if (missing.length > 0) {
  console.error(`도입부가 비어 있는 행 ${missing.length}건. 채우거나 openers.csv에서 삭제하세요:`);
  for (const email of missing.slice(0, 20)) console.error(`  ✗ ${email}`);
  process.exit(1);
}

const out = join(root, "private/recipients.json");
writeFileSync(out, JSON.stringify(recipients, null, 2), "utf8");
console.log(`수신자 ${recipients.length}명 → ${out}`);
```

- [ ] **Step 2: 뼈대를 생성한다**

Run: `pnpm tsx scripts/press/build-recipients.ts --skeleton`
Expected: `private/openers.csv`에 검수 통과한 인원 수만큼 행이 생긴다.

- [ ] **Step 3: 도입부를 작성한다**

Claude가 `private/openers.csv`의 `opener` 열을 채운다. 규칙:

- 2~3문장. 존댓말. 홍보 문구가 아니라 사람이 사람에게 쓰는 편지의 첫머리
- **같은 행의 `name`·`role`에 적힌 것만 근거로 삼는다.** 그 밖의 사실은 한 글자도 지어내지 않는다
- 금지 표현: "지난번 쓰신", "읽었습니다", "오랜만", "팬입니다", "독점", "약속드립니다"
- 세그먼트별 결:
  - `critic` — 음악을 평가하는 사람에게 음반 한 장을 건네는 어조
  - `music-press` — 발매·공연이라는 사실을 전하는 어조
  - `culture-desk` — 문화면 소재로서의 의미를 짧게 전하는 어조
- `role`이 비어 있거나 부실하면 매체명 없이 일반적인 존칭으로 쓴다. 억지로 구체화하지 않는다

- [ ] **Step 4: 도입부를 사람이 검수한다**

`private/openers.csv`를 스프레드시트로 열어 전 행을 훑는다. 정규식이 못 잡는 것 — 지어낸 매체명, 어색한 존칭, 잘못 붙은 직함 — 을 여기서 잡는다. **이것이 두 번째이자 마지막 방어선이다.**

- [ ] **Step 5: `recipients.json`으로 변환한다**

Run: `pnpm tsx scripts/press/build-recipients.ts`
Expected: `수신자 N명 → private/recipients.json`. 빈 도입부가 있으면 여기서 멈춘다.

- [ ] **Step 6: 렌더링 검사와 프리뷰를 돌린다**

Run: `pnpm tsx scripts/press/render.ts`
Expected: `검사 통과` 후 `private/preview.html` 생성. 브라우저로 열어 앞 20통의 실제 생김새를 확인한다.

걸리는 게 있으면 `openers.csv`를 고치고 Step 5부터 반복한다.

- [ ] **Step 7: 개인정보가 커밋 대상이 아닌지 다시 확인한다**

```bash
git status --short
```

Expected: `scripts/press/build-recipients.ts`만 보인다. `private/` 아래 파일이 하나라도 보이면 즉시 멈추고 gitignore를 고친다.

- [ ] **Step 8: 커밋**

```bash
git add scripts/press/build-recipients.ts
git commit -m "개인화 도입부 수집·검수 도구"
```

---

## Task 13: 1차 발송 실행

**Files:** 없음 (운영 작업)

**Interfaces:**
- Consumes: Task 6(배포된 프레스 페이지)과 Task 12(`private/recipients.json`) 전부
- Produces: `private/send-log.jsonl`

**이 태스크는 자동으로 진행하지 않는다.** 각 배치는 사람이 명령을 직접 실행하고, 다음 배치 전에 지표를 확인한다.

- [ ] **Step 1: 본인 주소로 테스트 1통을 보낸다**

```bash
pnpm tsx scripts/press/send.ts --test hwangtab@gmail.com
```

Expected: `테스트 발송 완료 ✓`

받은편지함에서 확인할 것:
- 발신자가 `마리코 & 유키에`로 보이는가
- 회신을 누르면 `hwangtab@gmail.com`이 뜨는가
- 프레스 페이지 링크가 눌리고 실제로 열리는가
- 스팸함이 아니라 받은편지함에 왔는가
- 모바일 Gmail 앱에서 레이아웃이 깨지지 않는가

- [ ] **Step 2: 첫 배치 — `critic` 25통**

```bash
pnpm tsx scripts/press/send.ts --send --segment critic --limit 25
```

`"보내기"`를 입력한다. 약 15초 걸린다.

- [ ] **Step 3: 24시간 기다리며 지표를 확인한다**

Resend 대시보드에서 확인한다. 임계를 넘으면 **즉시 중단하고 리스트를 다시 정제한다.**

| 지표 | 임계 |
|---|---|
| 반송률 | 5% (25통 중 2통 이상이면 멈춘다) |
| 스팸 신고 | 0.1% (한 건이라도 나오면 원인을 찾는다) |
| 도메인 상태 | Resend 대시보드에서 경고 없음 |

- [ ] **Step 4: 남은 배치를 하루 하나씩 진행한다**

지표가 깨끗할 때만 다음으로 넘어간다.

```bash
# D+1 — critic 나머지
pnpm tsx scripts/press/send.ts --send --segment critic --limit 30

# D+2 — music-press 전체
pnpm tsx scripts/press/send.ts --send --segment music-press --limit 50

# D+3 · D+4 · D+5 — culture-desk 3분할
pnpm tsx scripts/press/send.ts --send --segment culture-desk --limit 36
```

이미 보낸 주소는 로그를 읽어 자동으로 건너뛴다. 같은 명령을 다시 실행해도 중복 발송되지 않는다.

- [ ] **Step 5: 회신을 관리한다**

회신은 `hwangtab@gmail.com`으로 온다. 회신한 사람은 별도로 표시해 2차 발송에서 제외한다. 자료 요청에는 그날 안에 답한다 — 마감이 있는 사람들이다.

- [ ] **Step 6: 발송 결과를 집계한다**

```bash
pnpm tsx -e "
const { readFileSync } = require('node:fs');
const lines = readFileSync('private/send-log.jsonl','utf8').split('\n').filter(Boolean).map(JSON.parse);
const ok = lines.filter(l => l.ok).length;
console.log('발송', lines.length, '· 성공', ok, '· 실패', lines.length - ok);
const bySeg = {};
for (const l of lines) if (l.ok) bySeg[l.segment] = (bySeg[l.segment] ?? 0) + 1;
console.log(bySeg);
"
```

---

## Self-Review

**스펙 커버리지**

| 스펙 항목 | 태스크 |
|---|---|
| §3-1 발매일 반영 | Task 1 |
| §3-2 국면 전환 | Task 2 |
| §3-3 프레스 페이지(재생·가사·재킷) | Task 3, 4, 5 |
| §4 파이프라인 5단계 | Task 7~12 |
| §4 private 격리 | Task 7 Step 1-2 |
| §4 드라이런·테스트·확인 프롬프트·재개 | Task 11 |
| §5 세그먼트 분류·검수 | Task 9 |
| §6 문안 4블록·앵글·철칙·제목 | Task 10, 12 |
| §7 분할 일정·임계 감시 | Task 13 |
| §8 성과 측정 | Task 13 Step 5-6 |

**알려진 편차**

- 스펙 §5는 1차를 210명으로 잡았지만, Task 9의 미술 매체 배제 규칙이 몇 명을 `unknown`으로 옮기므로 실제 수는 그보다 조금 적다. `segments.csv` 검수에서 확정된다.
- 스펙 §6은 제목 A/B 절반 분할을 말하지만, Task 10의 `renderEmail`은 현재 A만 쓴다. 발송 규모가 작아 A/B 결과의 통계적 의미가 약하고, 변수를 늘리면 도달 문제와 제목 효과를 구분할 수 없기 때문이다. `SUBJECTS.B`는 정의돼 있으므로 2차 발송에서 바꿔 쓸 수 있다.

# 기술 설계 (Tech Spec)

**문서 버전:** v1.0
**작성일:** 2026년 6월 2일
**연관:** [02-content-spec](./02-content-spec.md), [04-i18n](./04-i18n-strategy.md), [06-seo](./06-seo-analytics-perf.md)

---

## 1. 기술 스택

기획안 7-3에서 확정된 방향(Next.js / TypeScript, 황경하 단독 개발)을 따른다.

| 영역 | 선택 | 비고 |
|------|------|------|
| 프레임워크 | **Next.js (App Router)** + TypeScript | 정적 생성·i18n·이미지 최적화 내장 |
| 렌더링 | **SSG(정적 생성)** 중심 | 콘텐츠가 파일 기반이라 빌드 타임에 전부 생성 가능 |
| 콘텐츠 | **마크다운 + JSON (파일 기반)** | CMS 미도입 확정. `02` 디렉터리 구조 |
| 스타일 | Tailwind CSS (또는 CSS Modules) | 디자인 토큰은 `03` 팔레트와 동기화 |
| 마크다운 처리 | next-mdx / contentlayer / gray-matter + remark 중 택1 | frontmatter + 본문 파싱 |
| i18n | App Router `[lang]` 세그먼트 + 메시지 사전 | `04` 정책 |
| 배포 | **Vercel**(권장) 또는 정적 호스팅 | PR 프리뷰·도메인 관리 용이 |
| 분석 | `06`에서 확정 | 개인정보 친화 옵션 우선 |

> 라이브러리 세부 선택(contentlayer vs 직접 파싱 등)은 구현 착수 시 1개로 확정하고 본 문서에 기록한다.

---

## 2. 아키텍처 개요

```
┌─────────────────────────────────────────┐
│  content/  (md + json)  ← 단일 콘텐츠 출처 │
│  messages/ (ko.json, ja.json)            │
└───────────────┬─────────────────────────┘
                │ 빌드 타임 로드/파싱
                ▼
┌─────────────────────────────────────────┐
│  Next.js (App Router, SSG)               │
│   app/[lang]/...  라우트                  │
│   lib/content.ts  콘텐츠 로더             │
│   components/     공통 UI                 │
└───────────────┬─────────────────────────┘
                │ next build → 정적 산출물
                ▼
        Vercel / 정적 호스팅 (CDN)
```

런타임 서버 로직·DB 없음. 폼/동적 기능이 생기면 그때 서버리스 함수로 최소 도입.

---

## 3. 폴더 구조 (제안)

```
/
├─ app/
│  ├─ [lang]/
│  │  ├─ layout.tsx              # lang 컨텍스트·헤더·푸터
│  │  ├─ page.tsx                # 홈
│  │  ├─ artists/page.tsx
│  │  ├─ artists/[id]/page.tsx
│  │  ├─ album/page.tsx
│  │  ├─ album/[slug]/page.tsx
│  │  ├─ video/page.tsx
│  │  ├─ lyrics/page.tsx
│  │  ├─ lyrics/[slug]/page.tsx
│  │  ├─ live/page.tsx
│  │  └─ about/page.tsx
│  ├─ layout.tsx                 # 루트(html)
│  └─ sitemap.ts, robots.ts      # 06 연동
├─ content/                      # 02 콘텐츠 구조
│  ├─ artists/  album/  live/  data/
├─ messages/  ko.json  ja.json   # UI 문자열
├─ components/                   # Header, Footer, CTA, TrackList, ...
├─ lib/                          # content.ts, i18n.ts, seo.ts
├─ public/images/                # 최적화 이미지 (원본은 /images)
└─ docs/website/                 # 본 문서 세트
```

---

## 4. 콘텐츠 파이프라인

1. 빌드 시 `lib/content.ts`가 `content/`의 md/json을 읽어 타입드 객체로 로드.
2. `generateStaticParams`로 트랙 슬러그·아티스트 id·언어를 정적 경로로 펼침.
3. frontmatter는 `gray-matter`, 본문 md는 remark/MDX로 HTML 변환.
4. 누락 언어/필드는 `04` 폴백 규칙 적용 + 빌드 경고.

**타입 예시:**
```ts
type Locale = "ko" | "ja";
type Localized<T = string> = Record<Locale, T>;

interface Track {
  number: number;
  slug: string;
  title: Localized;
  type: Localized;
  language: Locale;
  isTitle: boolean;
  isBonus: boolean;
  hasMV: boolean;
  lyricsSlug: string | null;
  previewUrl: string | null;
  body: Localized;        // 트랙 비하인드 본문(HTML)
}
```

콘텐츠 무결성 검사(빌드 전 스크립트 권장):
- `tracks.json` 슬러그 ↔ `album/tracks/*` 파일 일치
- 외부 링크 빈 값은 경고만(차단 아님)
- 이미지 경로 존재 여부

---

## 5. 이미지 처리

- 원본 `images/`(`album_cover.jpg`, `namsan_*.png`)를 가공해 `public/images/`에 배치하거나 `next/image`로 최적화.
- `next/image`로 반응형·지연 로딩·WebP/AVIF 자동 변환.
- 키비주얼은 우선순위 로딩(LCP 대상), 갤러리는 지연 로딩.

---

## 6. i18n 구현 메모

- `app/[lang]/` 동적 세그먼트 + `generateStaticParams`로 `ko`/`ja` 모두 정적 생성.
- 루트 미들웨어(또는 `/` 페이지)에서 `Accept-Language` 1회 분기(`04`).
- 메시지 사전은 서버 컴포넌트에서 직접 import(런타임 비용 최소).

---

## 7. 배포·운영

- **호스팅:** Vercel 권장 — Git 푸시 시 자동 빌드·프리뷰 URL, 도메인·HTTPS 관리.
- **브랜치 전략:** `main` 배포, 작업은 피처 브랜치 → 프리뷰 확인 후 머지.
- **콘텐츠 업데이트:** md/json 수정 → 커밋/푸시 → 자동 재배포(`07` 워크플로).
- **도메인:** `00` Open Q (전용 도메인 vs 하위 경로) 확정 후 연결.

---

## 8. 확정 필요

- [ ] 마크다운 처리 라이브러리 1개 확정(contentlayer / next-mdx / 직접 파싱)
- [ ] 스타일 솔루션 확정(Tailwind 가정)
- [ ] 호스팅·도메인 확정
- [ ] 콘텐츠 무결성 검사 스크립트 작성 여부
- [ ] 콘텐츠 파일 명명 규칙 최종(`*.ko.md` vs `ko/` 디렉터리)

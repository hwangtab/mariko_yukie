# SEO · 분석 · 성능

**문서 버전:** v1.0
**작성일:** 2026년 6월 2일
**연관:** [00-PRD](./00-PRD.md), [04-i18n](./04-i18n-strategy.md), [05-tech-spec](./05-tech-spec.md)

---

## 1. SEO 목표

거점 사이트이므로 검색에서 "마리코 & 유키에"와 앨범·곱창전골 관련 질의에 도달 가능해야 한다. (`00` KPI)

**핵심 타깃 키워드**
- 마리코 유키에 / Mariko & Yukie / マリコ&ユキエ
- 남산타워 앨범 / Namsan Tower album
- 사토유키에 / 곱창전골 / Sato Yukie / Kopchangjeongol
- 트로트 마리코 / Trot MARIKO

---

## 2. 온페이지 SEO

- 페이지별 고유 `<title>` / `meta description` (양언어 분리, `04`).
- 시맨틱 마크업(h1 1개, 논리적 헤딩 계층, 본문 구조화).
- canonical URL 지정, 페이지별 정확한 `<html lang>`.
- 이미지 `alt`(아티스트·앨범·남산타워 설명 포함).
- 깔끔한 슬러그(`/album/namsan-tower`), 빵부스러기(breadcrumb) 검토.

---

## 3. 다국어 SEO (`04` 연동)

- `hreflang` 상호 링크: `ko` ↔ `ja` + `x-default`.
- 언어별 sitemap 엔트리 모두 포함.
- 폴백으로 노출되는 페이지가 잘못된 언어로 인덱싱되지 않도록 주의.

---

## 4. 구조화 데이터 (JSON-LD)

| 타입 | 적용 페이지 | 비고 |
|------|-------------|------|
| `MusicGroup` | 아티스트/홈 | 마리코 & 유키에 (member: 2인) |
| `Person` | 각 아티스트 | 마리코·사토유키에, sameAs(SNS) |
| `MusicAlbum` | 앨범 | byArtist, numTracks 15, datePublished 2026-08 |
| `MusicRecording` | 트랙 상세 | 곡별 |
| `VideoObject` | 뮤직비디오 | 유튜브 임베드 |
| `MusicEvent` | 공연 | 발매 공연(확정 후 채움) |
| `BreadcrumbList` | 하위 페이지 | 내비게이션 |

- `sameAs`에 SNS·유튜브·페이스북 연결(엔티티 신뢰도).
- 미확정 값(날짜·장소·링크)은 비워두고, 확정 시 채운다.

---

## 5. 소셜 공유 (OG / Twitter Card)

- `og:title`, `og:description`, `og:image`, `og:locale`(ko_KR / ja_JP), `og:type`(music.album 등).
- Twitter `summary_large_image`.
- **OG 이미지:** 앨범 커버/키비주얼 기반 1200×630. 페이지 유형별(앨범·아티스트·트랙) 이미지 차별화 검토 — SNS 유입이 주 채널이라 중요.

---

## 6. 분석 (Analytics)

`00` 비기능 요구(개인정보 친화) 반영. 후보 비교 후 1개 확정.

| 후보 | 장점 | 단점 |
|------|------|------|
| Vercel Web Analytics | 호스팅 통합, 쿠키리스, 설정 간단 | 이벤트 기능 제한적 |
| Plausible / Umami | 경량·개인정보 친화, 쿠키 배너 불필요 | 별도 비용/셀프호스팅 |
| GA4 | 무료, 강력 | 쿠키 동의·개인정보 부담 |

**추적할 이벤트 (`00` KPI 연동)**
- `cta_tumblbug_click` — 텀블벅 아웃바운드
- `outbound_click` — 유튜브/음원/SNS (label로 구분)
- `mv_play` — 뮤직비디오 재생(가능 범위)
- `lang_switch` — 언어 전환
- `press_download` — (2차) 프레스 자료 다운로드

> GA4 외 옵션 채택 시 쿠키 동의 배너를 생략할 수 있어 사용자 경험·운영이 단순. **Plausible/Umami 또는 Vercel Analytics 권장.**

---

## 7. 성능 목표 (Core Web Vitals)

| 지표 | 목표 | 수단 |
|------|------|------|
| LCP | < 2.5s (모바일 4G) | SSG, 키비주얼 우선 로딩, 이미지 최적화 |
| CLS | < 0.1 | 이미지·폰트 크기 예약, 레이아웃 안정 |
| INP | < 200ms | 자바스크립트 최소, 정적 위주 |
| 폰트 | FOIT/FOUT 최소 | `font-display: swap`, 서브셋, 프리로드 |
| 번들 | 최소화 | 불필요 클라이언트 컴포넌트 지양(서버 컴포넌트 우선) |

- Lighthouse 모바일 90+ 목표.
- 유튜브 임베드는 **파사드(썸네일 클릭 후 로드)** 패턴으로 초기 로딩 부담 제거.

---

## 8. 인덱싱·운영

- `robots.txt` + `sitemap.xml`(Next 자동 생성, `app/sitemap.ts`).
- Google Search Console + (일본 도달 위해) 필요 시 Bing 등록.
- 배포 후 색인 요청, 주요 키워드 노출 모니터링(`00` KPI).

---

## 9. 확정 필요

- [ ] 분석 도구 1개 확정(권장: Plausible/Umami 또는 Vercel Analytics)
- [x] OG 이미지 소스 확정 → 앨범 커버(`images/album_cover.jpg`) 활용. 1200×630 크롭본 제작만 남음
- [ ] Search Console 등록 계정·도메인 확정

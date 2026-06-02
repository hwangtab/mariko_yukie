# 마리코 & 유키에 (Mariko & Yukie) — 공식 웹사이트

앨범 《남산타워》(2026) 발매에 맞춰 제작한 두 아티스트의 **영구 디지털 거점**.
한국어·일본어 양언어, 파일 기반 콘텐츠, 정적 생성.

## 스택

- **Next.js 15 (App Router)** + TypeScript
- **Tailwind CSS v4** — 디자인 v2.0(70s 사이키델릭·큐트, 앨범 커버 기반)
- 파일 기반 콘텐츠 (`lib/content.ts`) — CMS 없음
- i18n: `/ko` `/ja` 경로 라우팅 (`middleware.ts`)
- 이미지: MV 촬영 스틸 선별·WebP 최적화본 `public/images/` (next/image `unoptimized`)
- 폰트: Bagel Fat One·Mochiy Pop One(디스플레이) / Gowun Dodum·Zen Maru Gothic(본문) / Gaegu·DotGothic16(악센트)

## 개발

```bash
pnpm install
pnpm dev          # http://localhost:3000 → /ko 또는 /ja 로 자동 분기
pnpm build        # 정적 빌드
pnpm start        # 프로덕션 서버
```

## 구조

```
app/[lang]/        언어별 라우트 (홈·artists·album·video·gallery·lyrics·live·about)
components/         Header, Footer, CTABlock, TrackList, Gallery, RetroImage, Reveal, ui(별·리본·웨이브·그루비)
lib/
  i18n.ts          로케일·UI 문자열 사전
  content.ts       콘텐츠 SSOT (아티스트·트랙·앨범·이벤트·링크·크레딧·갤러리·스토리·트리비아·이미지)
middleware.ts      로케일 리다이렉트
app/sitemap.ts     · robots.ts · icon.svg
public/images/     WebP 이미지 자산
docs/website/      기획·설계 문서 (PRD·IA·콘텐츠·디자인·i18n·기술·SEO·체크리스트)
```

콘텐츠는 검증된 리서치로 보강됨(아티스트 인용·「음악의 뿌리」 음악사 스토리·남산타워 트리비아). 가사·MV 임베드는 미확정으로 안전 처리(곧 공개/폴백).

## 콘텐츠 수정

대부분 `lib/content.ts` 한 곳에서 KO/JA를 함께 편집합니다.

- **외부 링크**(텀블벅 URL, 뮤직비디오 ID, 음원 스트리밍): `links` 객체 — 빈 값은 UI에서 자동 숨김/“곧 공개” 처리
- **공연·소식**: `events` 배열 (미정은 `dateLabel`/`note`로 안전 표기)
- **트랙 비하인드 / 아티스트 서사**: `tracks`, `artists` 배열

자세한 운영 워크플로는 [docs/website/07-launch-ops-checklist.md](docs/website/07-launch-ops-checklist.md) 참조.

## 배포 전 확정 필요 (docs/website 참조)

- 도메인 → `NEXT_PUBLIC_SITE_URL` 환경변수 (sitemap/robots)
- 텀블벅 URL, 뮤직비디오 YouTube ID, 음원 스트리밍 링크
- 가사 공개 범위, 앨범 커버·로고 확정본, 분석 도구 연동

# 콘텐츠 명세 — 페이지 구성·데이터 스키마·소스 매핑

**문서 버전:** v1.0
**작성일:** 2026년 6월 2일
**연관:** [01-IA](./01-information-architecture.md), [04-i18n](./04-i18n-strategy.md), [05-tech-spec](./05-tech-spec.md)

> 모든 텍스트 콘텐츠는 마크다운/JSON 파일로 관리하고 빌드 시 정적 생성한다. 사실관계의 단일 출처는 `docs/plan/`이다.

---

## 1. 콘텐츠 원천 (Source of Truth)

| 콘텐츠 | 원천 파일 |
|--------|-----------|
| 아티스트 서사·이력 | `docs/plan/album_plan.md` PART 1, `docs/plan/tumblbug/funding_plan.md` 아티스트 히스토리 |
| 앨범 컨셉·트랙 소개 | `album_plan.md` PART 2, `funding_plan.md` 수록곡 소개 |
| 음반 사양 | `funding_plan.md` 음반 사양 |
| 가사 | `docs/lyrics/*.docx` (웹 게재용 정리 필요) |
| 이미지 | `images/album_cover.jpg`, `images/namsan_*.png` |
| 공연·일정 | `album_plan.md` 5-2 타임라인, 7-1 발매 공연 |
| 크레딧 | `funding_plan.md` 프로젝트 팀 |

---

## 2. 콘텐츠 디렉터리 구조 (제안)

언어별로 본문을 분리하고, 언어 무관 데이터(슬러그·이미지·링크)는 공통으로 둔다. 상세 구현은 `05-tech-spec`.

```
content/
├─ artists/
│  ├─ mariko.ko.md      mariko.ja.md
│  └─ yukie.ko.md       yukie.ja.md
├─ album/
│  ├─ album.ko.md       album.ja.md      (앨범 개요)
│  └─ tracks/
│     ├─ 02-sarang-ui-suljan.ko.md / .ja.md
│     ├─ 05-namsan-tower.ko.md / .ja.md
│     └─ ...             (트랙별)
├─ live/
│  └─ release-show.ko.md / .ja.md
└─ data/
   ├─ tracks.json       (트랙 마스터: 번호·슬러그·제목·언어·성격)
   ├─ discography.json  (마리코·곱창전골·솔로)
   ├─ events.json       (공연·일정)
   ├─ links.json        (외부 링크: 텀블벅·유튜브·SNS·음원)
   └─ credits.json      (프로젝트 팀)
```

> `.ko.md`/`.ja.md` 명명은 한 예시이며, 디렉터리 분리(`/ko`, `/ja`) 방식도 가능 — `05-tech-spec`에서 확정.

---

## 3. 데이터 스키마

### 3.1 트랙 마스터 (`tracks.json`)

트랙 슬러그·번호의 단일 출처. IA의 URL 슬러그와 일치해야 한다.

```jsonc
{
  "number": 5,                    // 트랙 번호 (1~15)
  "slug": "namsan-tower",         // URL 슬러그 (언어 무관 고정)
  "title": { "ko": "남산타워 Namsan Tower Lights", "ja": "南山タワー Namsan Tower Lights" },
  "type": { "ko": "그룹 사운드, 타이틀곡", "ja": "..." },
  "language": "ko",               // 원곡 언어 ko | ja
  "isTitle": true,                // 타이틀곡 여부
  "isBonus": false,
  "hasMV": true,
  "lyricsSlug": "namsan-tower",   // 가사 연결 (없으면 null)
  "previewUrl": null              // 미리듣기 클립(있을 때)
}
```

**트랙 목록 (기획안 2-3 기준, 슬러그는 제안 — 확정 필요):**

| # | 제목 | slug(제안) | 성격 |
|---|------|-----------|------|
| 01 | 마리 유키 테마 | `mariyuki-theme` | 인트로 소곡 |
| 02 | 사랑의 술잔 | `sarang-ui-suljan` | 듀엣, 그룹 사운드 |
| 03 | 핫 플래시 | `hot-flash` | 그룹 사운드+트로트 |
| 04 | 맥주와 커피 | `beer-and-coffee` | 듀엣, 서정 |
| 05 | 남산타워 Namsan Tower Lights | `namsan-tower` | 타이틀, MV |
| 06 | 맞아 맞아 송 | `maja-maja-song` | 경쾌한 그룹 사운드 |
| 07 | 술 소독 Blues | `sul-sodok-blues` | 듀엣, 블루스, 헌정 |
| 08 | 홍어의 눈물 | `hongeo-tears` | 마리코 솔로, 트로트 |
| 09 | 안녕 내사랑 | `annyeong-my-love` | 듀엣, 버블검 팝 |
| 10 | 고향 | `gohyang` | 사토유키에 솔로 |
| 11 | 사랑의 술잔 (일본어) | `sarang-ui-suljan-ja` | 02 일본어 |
| 12 | 핫 플래시 (일본어) | `hot-flash-ja` | 03 일본어 |
| 13 | 맥주와 커피 (일본어) | `beer-and-coffee-ja` | 04 일본어 |
| 14 | 남산타워 (일본어) | `namsan-tower-ja` | 05 일본어 |
| 15 | 꿈 속에서 본 사람 (일본어) | `yume-no-hito` | 보너스 |

### 3.2 트랙 본문 (`album/tracks/*.md` frontmatter + 본문)

```yaml
---
slug: namsan-tower
number: 5
---
```
본문: 트랙 소개·비하인드 (사토유키에 직접 작성분). 펀딩 원고의 곡 소개를 1차 콘텐츠로 활용하고, 사이트 전용으로 보강.

### 3.3 아티스트 (`artists/*.md`)

```yaml
---
id: yukie            # mariko | yukie
name: { ko: "사토유키에", ja: "佐藤行衛" }
roman: "Sato Yukie"
tagline: { ko: "한국 록의 고고학자", ja: "..." }
photo: "/images/artists/yukie.jpg"
links:
  youtube: "https://www.youtube.com/channel/UC6PtS4px3uFY8HKZnM4SzWA"
  facebook: "https://www.facebook.com/Kopchangjeongol"
---
```
본문: 서사형 소개(기획안 1-1 / 1-2). 디스코그래피·이력 표는 `discography.json` 참조 렌더.

### 3.4 이벤트 (`events.json`)

```jsonc
{
  "id": "release-show-2026",
  "type": "release",                 // release | tour | news
  "title": { "ko": "《남산타워》 발매 공연", "ja": "..." },
  "date": null,                       // 미정 → null, 확정 시 ISO 날짜
  "dateLabel": { "ko": "2026년 8월 (예정)", "ja": "2026年8月(予定)" },
  "venue": { "ko": "서울 홍대 인근 (미정: 롤링홀/프리즘홀)", "ja": "..." },
  "note": { "ko": "후원자 초청 무료·클로즈드 공연", "ja": "..." },
  "status": "tentative"               // tentative | confirmed | past
}
```

### 3.5 외부 링크 (`links.json`)

```jsonc
{
  "tumblbug": "",                     // 펀딩 오픈 시 확정
  "musicVideoYoutubeId": "",          // 영상 ID
  "streaming": { "spotify": "", "appleMusic": "", "youtubeMusic": "", "melon": "" },
  "sns": {
    "marikoInstagram": "https://instagram.com/mariko_1109",
    "marikoTwitter": "https://twitter.com/torotto9",
    "yukieYoutube": "https://www.youtube.com/channel/UC6PtS4px3uFY8HKZnM4SzWA",
    "yukieFacebook": "https://www.facebook.com/Kopchangjeongol"
  }
}
```

빈 값(`""`/`null`)은 UI에서 자동 숨김 처리 → 미확정 정보가 깨진 링크로 노출되지 않게 한다.

---

## 4. 페이지별 콘텐츠 구성

### 홈 `/`
- 키비주얼(앨범 커버 또는 남산타워 야경) + 영문 로고 "Mariko & Yukie"
- 한 줄 컨셉: *"60~70년대 음악을 몸으로 관통한 사람이 2026년에 내는 음반"*
- 진입 카드: 앨범 / 아티스트 / 뮤직비디오 / (펀딩 기간) 텀블벅
- 상황별 CTA 블록

### 아티스트 `/artists`, `/artists/[id]`
- 인덱스: 두 사람 + 듀오 소개 짧게
- 개별: 서사 본문 + 이력표 + 외부 링크. "역방향 한일 교류" 같은 포지셔닝 메시지 포함

### 앨범 `/album`
- 앨범 컨셉 문장 + "앨범이 말하는 것"
- 트랙리스트(15) — 클릭 시 트랙 상세
- 음반 사양 표 (15트랙/한10·일5/CD+디지털/12p 부클릿 등)
- 독창성 포지셔닝(5포인트)

### 트랙 상세 `/album/[slug]`
- 제목·번호·성격 태그, 비하인드 본문, 가사 링크, (있으면) 미리듣기/MV

### 뮤직비디오 `/video`
- 유튜브 임베드 + 컨셉(쇼와 버라이어티·빈티지 필름 톤) 설명
- 링크 미확정 시 "곧 공개" 플레이스홀더

### 가사 `/lyrics`, `/lyrics/[slug]`
- 곡별 한·일 가사 + 짧은 배경 메모
- **공개 범위 확정 필요**(`00` Open Q): 전문 / 일부 / PDF 안내만

### 공연·소식 `/live`
- 발매 공연 안내(무료·클로즈드·후원자 초청), 투어 검토(대구 등), 소식
- 미정 항목은 `dateLabel`/`note`로 안전하게 표기

### About `/about`
- 프로젝트 개요, 프로젝트 팀/크레딧, 미디어 문의, SNS
- 크레딧 중 "공개 협의 중" 항목은 표기 보류

---

## 5. 콘텐츠 작업 항목 (To-do)

- [x] `docs/lyrics/*.docx` → `lib/lyrics.ts`로 추출·정리(트랙 02~10 한국어 원곡, 연 단위). 일본어 재해석본은 추후 추가
- [ ] 트랙 슬러그 15개 확정 (위 표 검토)
- [ ] 아티스트 프로필 사진 웹 최적화본 배치(`/images/artists/`)
- [x] 앨범 커버 확정 (`images/album_cover.jpg`) — 사이키델릭·큐트 키비주얼 (`03` v2.0)
- [ ] 뮤직비디오 유튜브 ID 입력(공개 시)
- [ ] 텀블벅 URL 입력(오픈 시)
- [ ] 일본어 본문 정리(펀딩 원고 JA·기획안 JA 재활용 — `04` 참조)
- [ ] 크레딧 공개 가능 범위 확인

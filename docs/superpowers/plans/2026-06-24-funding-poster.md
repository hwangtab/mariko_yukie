# 펀딩 홍보 세로 포스터 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 《남산타워》 텀블벅 펀딩 홍보용 SNS 세로 포스터(4:5)를 한국어·일본어 2벌 제작한다.

**Architecture:** standalone HTML 포스터 템플릿을 `_workspace/posters/`에 작성하고(사이트 `globals.css` 토큰·Google Fonts 재사용), 남산 야경 스틸을 풀블리드 배경으로 깔고 중앙에 앨범 커버를 카드로 얹는다. 텀블벅 QR을 `pnpm dlx qrcode`로 생성해 삽입하고, 연결된 Playwright MCP로 1080×1350 뷰포트를 캡처한다. 시각 산출물이므로 각 태스크는 캡처 PNG를 Read로 육안 검증하는 게이트로 마감한다.

**Tech Stack:** standalone HTML/CSS, Google Fonts CDN, `qrcode` CLI(via pnpm dlx), Playwright MCP(캡처).

## Global Constraints

- 규격: **1080 × 1350 px (4:5)**. Playwright 뷰포트를 정확히 이 값으로 고정.
- 산출물 위치: `_workspace/posters/` (배포물 아님 — 사이트 공개 라우트로 노출 금지).
- QR 목적지: `https://tumblbug.com/marikoandyukie` (절대 변경 금지). QR은 **스캔 정확도 최우선** — 밝은 배경 위 진한 모듈, 충분한 quiet zone.
- 언어 2벌: `poster-ko.png`, `poster-ja.png`. 동일 레이아웃, 카피만 교체. 두 아티스트 동등 톤.
- 발매월: **2026년 9월** (8월 아님).
- 컬러 토큰(`app/globals.css` 발췌): coral `#f0612f`, pink `#ec6ba8`, yellow `#f5b733`, navy `#1c2750`, cream `#f8efdc`, night `#221a3f`, night-deep `#16102b`.
- 폰트: 제목 `Bagel Fat One`(ko)/`Mochiy Pop One`(ja), 본문 `Gowun Dodum`(ko)/`Zen Maru Gothic`(ja).
- 이미지 참조는 절대 `file://` 경로 사용: `/Users/hwang-gyeongha/mariko_yukie/public/images/...`.

---

### Task 1: 작업 디렉토리 + 텀블벅 QR 생성

**Files:**
- Create: `_workspace/posters/` (디렉토리)
- Create: `_workspace/posters/qr-tumblbug.png`

**Interfaces:**
- Produces: `_workspace/posters/qr-tumblbug.png` — 포스터 HTML이 `<img>`로 참조하는 QR 이미지.

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p /Users/hwang-gyeongha/mariko_yukie/_workspace/posters
```

- [ ] **Step 2: QR PNG 생성 (설치 없이 일회성)**

높은 오류정정 레벨(H)·여백 4·큰 사이즈로 스캔 신뢰도 확보.

```bash
cd /Users/hwang-gyeongha/mariko_yukie/_workspace/posters
pnpm dlx qrcode -e H -m 4 -w 600 -d "#1c2750" -l "#ffffff" \
  -o qr-tumblbug.png "https://tumblbug.com/marikoandyukie"
```

만약 `qrcode` CLI 플래그가 위 형태를 거부하면(버전차), 최소형으로 재시도:
```bash
pnpm dlx qrcode -o qr-tumblbug.png "https://tumblbug.com/marikoandyukie"
```

- [ ] **Step 3: 생성 확인**

Run: `ls -la /Users/hwang-gyeongha/mariko_yukie/_workspace/posters/qr-tumblbug.png`
Expected: 파일 존재, 수 KB 이상.

- [ ] **Step 4: QR 스캔성 육안 검증**

`Read` 도구로 `qr-tumblbug.png`를 열어 QR 패턴(파인더 패턴 3개 모서리)이 또렷하고 뭉개지지 않았는지 확인.

- [ ] **Step 5: Commit**

`_workspace/`는 .gitignore 대상일 수 있다. 먼저 확인 후, 추적 대상이 아니면 커밋 생략(산출물은 비배포).
```bash
cd /Users/hwang-gyeongha/mariko_yukie
git check-ignore _workspace/posters/qr-tumblbug.png && echo "ignored — 커밋 생략" || git add _workspace/posters/qr-tumblbug.png
```

---

### Task 2: 야경 배경 컷 선정

**Files:**
- 참조: `/Users/hwang-gyeongha/mariko_yukie/public/images/namsan_*.webp`

**Interfaces:**
- Produces: `BG_IMAGE` — 채택한 야경 스틸의 절대 경로(예: `.../public/images/namsan_69.webp`). Task 3가 배경으로 사용.

- [ ] **Step 1: 후보 컷 육안 비교**

`Read` 도구로 다음 후보를 차례로 열어 비교: `namsan_69.webp`, `namsan_33.webp`, `namsan_30.webp`, `namsan_44.webp`, `namsan_22.webp`, `namsan_29.webp`.
선정 기준: (1) 충분히 어두워 흰 텍스트가 얹힘, (2) 상단/하단에 여백(하늘·도시 빛)이 있어 리본·QR 배치 공간 확보, (3) 남산타워가 보이면 가점.

- [ ] **Step 2: 1컷 확정**

가장 적합한 컷의 절대 경로를 `BG_IMAGE`로 확정해 기록(이후 태스크에서 사용). 애매하면 `namsan_69.webp`를 기본값으로.

---

### Task 3: 한국어 포스터 HTML 템플릿 작성

**Files:**
- Create: `_workspace/posters/poster.html`

**Interfaces:**
- Consumes: `qr-tumblbug.png`(Task 1), `BG_IMAGE`(Task 2), `album_cover.webp`.
- Produces: `_workspace/posters/poster.html` — `?lang=ko|ja` 쿼리로 언어 분기하는 단일 템플릿. Task 5가 캡처, Task 6이 ja로 재사용.

- [ ] **Step 1: HTML 작성**

아래 전체 내용으로 `_workspace/posters/poster.html` 생성. `BG_IMAGE`는 Task 2 확정 경로로 치환. 카피 데이터는 ko/ja 모두 내장하고 URL 쿼리 `?lang=`로 토글(기본 ko).

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Mochiy+Pop+One&family=Gowun+Dodum&family=Zen+Maru+Gothic:wght@500;700&family=Jua&display=swap" rel="stylesheet" />
<style>
  :root {
    --coral:#f0612f; --pink:#ec6ba8; --yellow:#f5b733;
    --navy:#1c2750; --cream:#f8efdc; --night:#221a3f; --night-deep:#16102b;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1080px; height:1350px; overflow:hidden; }
  .poster {
    position:relative; width:1080px; height:1350px;
    background:#000; overflow:hidden;
    font-family:"Gowun Dodum", sans-serif; color:var(--cream);
  }
  .bg {
    position:absolute; inset:0; width:100%; height:100%;
    object-fit:cover; z-index:0;
  }
  /* 가독성 오버레이 — 상·하단을 진하게 */
  .overlay {
    position:absolute; inset:0; z-index:1;
    background:
      linear-gradient(180deg,
        rgba(22,16,43,.78) 0%,
        rgba(34,26,63,.35) 28%,
        rgba(34,26,63,.30) 55%,
        rgba(22,16,43,.86) 82%,
        rgba(22,16,43,.96) 100%);
  }
  .content {
    position:relative; z-index:2; height:100%;
    display:flex; flex-direction:column; align-items:center;
    padding:64px 72px; text-align:center;
  }
  /* 리본 배너 */
  .ribbon {
    display:inline-flex; align-items:center; gap:12px;
    background:var(--coral); color:#fff;
    font-family:"Jua", sans-serif; font-size:34px; font-weight:700;
    padding:14px 38px; border-radius:999px;
    border:4px solid var(--navy);
    box-shadow:0 8px 0 rgba(28,39,80,.45);
    letter-spacing:.02em;
  }
  .ribbon .star { color:var(--yellow); font-size:30px; }
  /* 앨범 커버 카드 */
  .cover-wrap { margin-top:56px; }
  .cover {
    width:620px; height:620px; object-fit:cover;
    border-radius:28px; border:8px solid var(--navy);
    box-shadow:0 22px 48px rgba(0,0,0,.55);
  }
  /* 텍스트 블록 */
  .meta { margin-top:auto; }
  .album-line {
    font-family:"Jua", sans-serif; font-size:30px;
    color:#fff; opacity:.95;
  }
  .title {
    font-family:"Bagel Fat One", sans-serif;
    font-size:96px; line-height:1.05; color:#fff;
    margin:6px 0 18px;
    text-shadow:0 4px 0 var(--navy), 0 8px 22px rgba(0,0,0,.5);
  }
  .info {
    font-size:30px; line-height:1.6; color:var(--cream);
    text-shadow:0 2px 6px rgba(0,0,0,.7);
  }
  .info b { color:var(--yellow); }
  /* QR 영역 */
  .cta {
    margin-top:34px; display:flex; align-items:center; gap:24px;
    background:rgba(248,239,220,.96); border:5px solid var(--navy);
    border-radius:22px; padding:22px 30px;
    box-shadow:0 10px 26px rgba(0,0,0,.4);
  }
  .cta img { width:150px; height:150px; display:block; }
  .cta .txt { text-align:left; color:var(--navy); }
  .cta .txt .lead {
    font-family:"Jua", sans-serif; font-size:34px; color:var(--coral);
    line-height:1.2;
  }
  .cta .txt .url { font-size:24px; margin-top:8px; opacity:.85; }
  .handle {
    margin-top:30px; font-family:"Jua", sans-serif;
    font-size:28px; color:#fff; opacity:.9;
    text-shadow:0 2px 6px rgba(0,0,0,.7);
  }
  /* 일본어 폰트 스위치 */
  body.ja .poster { font-family:"Zen Maru Gothic", sans-serif; }
  body.ja .ribbon, body.ja .album-line, body.ja .cta .txt .lead, body.ja .handle { font-family:"Zen Maru Gothic", sans-serif; font-weight:700; }
  body.ja .title { font-family:"Mochiy Pop One", sans-serif; font-size:84px; }
</style>
</head>
<body>
  <div class="poster">
    <img class="bg" src="file:///Users/hwang-gyeongha/mariko_yukie/public/images/namsan_69.webp" alt="" />
    <div class="overlay"></div>
    <div class="content">
      <div class="ribbon"><span class="star">✦</span><span id="ribbon"></span><span class="star">✦</span></div>
      <div class="cover-wrap">
        <img class="cover" src="file:///Users/hwang-gyeongha/mariko_yukie/public/images/album_cover.webp" alt="남산타워 앨범 커버" />
      </div>
      <div class="meta">
        <div class="album-line" id="albumLine"></div>
        <div class="title" id="title"></div>
        <div class="info" id="info"></div>
        <div class="cta">
          <img src="file:///Users/hwang-gyeongha/mariko_yukie/_workspace/posters/qr-tumblbug.png" alt="텀블벅 QR" />
          <div class="txt">
            <div class="lead" id="ctaLead"></div>
            <div class="url">tumblbug.com/marikoandyukie</div>
          </div>
        </div>
        <div class="handle">@marikoandyukie</div>
      </div>
    </div>
  </div>
<script>
  const DATA = {
    ko: {
      ribbon: "텀블벅 펀딩 중",
      albumLine: "마리코 & 사토유키에 1st Album",
      title: "남산타워",
      info: '2026.9 발매 · CD <b>500장 한정</b><br>9.6 발매공연 @스페이스 한강',
      ctaLead: "스캔하고<br>펀딩 후원하기 →",
    },
    ja: {
      ribbon: "テンバグ ファンディング中",
      albumLine: "マリコ & サトユキエ 1st Album",
      title: "南山タワー",
      info: '2026.9リリース · CD <b>500枚限定</b><br>9.6 リリースライブ @スペース漢江',
      ctaLead: "スキャンして<br>応援する →",
    },
  };
  const lang = new URLSearchParams(location.search).get("lang") === "ja" ? "ja" : "ko";
  if (lang === "ja") document.body.classList.add("ja");
  const d = DATA[lang];
  ribbon.textContent = d.ribbon;
  albumLine.textContent = d.albumLine;
  title.textContent = d.title;
  info.innerHTML = d.info;
  ctaLead.innerHTML = d.ctaLead;
</script>
</body>
</html>
```

- [ ] **Step 2: `BG_IMAGE` 반영**

Task 2에서 `namsan_69` 외 컷을 골랐다면, `<img class="bg" src=...>`의 파일명을 그 경로로 수정.

---

### Task 4: 한국어판 캡처 + 시각 검수/조정

**Files:**
- Create: `_workspace/posters/poster-ko.png`
- Modify(필요시): `_workspace/posters/poster.html`

**Interfaces:**
- Consumes: `poster.html`(Task 3).
- Produces: `_workspace/posters/poster-ko.png`.

- [ ] **Step 1: 브라우저 뷰포트 고정**

Playwright MCP: `browser_resize`로 width=1080, height=1350.

- [ ] **Step 2: 포스터 페이지 로드**

Playwright MCP: `browser_navigate` →
`file:///Users/hwang-gyeongha/mariko_yukie/_workspace/posters/poster.html?lang=ko`

- [ ] **Step 3: 폰트·이미지 로딩 대기**

Playwright MCP: `browser_wait_for`로 약 1.5초 대기(웹폰트 swap·webp 디코드 완료 보장).

- [ ] **Step 4: 캡처**

Playwright MCP: `browser_take_screenshot` → filename `poster-ko.png`(가능하면 `_workspace/posters/`로 저장 또는 이후 이동). fullPage 불필요(뷰포트=캔버스).

- [ ] **Step 5: 육안 검수**

`Read`로 `poster-ko.png` 확인. 체크리스트:
- 앨범 커버가 중앙에서 잘리지 않고 또렷한가
- 제목/정보 텍스트가 야경 위에서 충분히 읽히는가(대비)
- 리본·QR 카드가 화면 밖으로 넘치지 않는가
- QR이 선명한가
- 1080×1350 비율이 맞는가

- [ ] **Step 6: 조정 반복**

문제가 있으면 `poster.html`의 해당 값(폰트 크기, padding, 오버레이 농도, cover 크기)을 수정하고 Step 2~5 반복. 통과할 때까지.

---

### Task 5: 일본어판 캡처 + 검수

**Files:**
- Create: `_workspace/posters/poster-ja.png`

**Interfaces:**
- Consumes: `poster.html`(동일 템플릿, `?lang=ja`).
- Produces: `_workspace/posters/poster-ja.png`.

- [ ] **Step 1: ja 로드**

Playwright MCP: `browser_navigate` →
`file:///Users/hwang-gyeongha/mariko_yukie/_workspace/posters/poster.html?lang=ja`
(뷰포트는 1080×1350 유지)

- [ ] **Step 2: 대기 후 캡처**

`browser_wait_for` 1.5초 → `browser_take_screenshot` → `poster-ja.png`.

- [ ] **Step 3: 육안 검수**

`Read`로 `poster-ja.png` 확인. ko 체크리스트 동일 적용 + 일본어 폰트(Mochiy Pop One/Zen Maru Gothic)가 깨지지 않고 적용됐는지, 일본어 텍스트가 박스를 넘치지 않는지 확인. 넘치면 `body.ja .title` 등 ja 전용 크기 조정 후 재캡처.

---

### Task 6: 최종 정리 + 인도

**Files:**
- 정리 대상: `_workspace/posters/`

- [ ] **Step 1: 산출물 확인**

Run: `ls -la /Users/hwang-gyeongha/mariko_yukie/_workspace/posters/`
Expected: `poster-ko.png`, `poster-ja.png`, `poster.html`, `qr-tumblbug.png` 존재.

- [ ] **Step 2: 두 PNG 최종 나란히 검수**

`Read`로 ko/ja 두 장을 다시 확인 — 동일 레이아웃·동등 톤, 발매월 9월, QR 목적지 일치.

- [ ] **Step 3: 사용자에게 결과 보고**

산출물 경로와 함께 두 포스터를 제시. 추가 규격(9:16 스토리 등)이나 카피 수정 필요 여부 확인.

# 펀딩 홍보 세로 포스터 — 구현 보고서

작성일: 2026-06-24
브랜치: `poster/funding-sns`

## 산출물
- `_workspace/posters/qr-tumblbug.png` — 텀블벅 QR (목적지 `https://tumblbug.com/marikoandyukie`, 오류정정 H, 여백 4, 600px, navy 모듈/흰 배경)
- `_workspace/posters/poster.html` — `?lang=ko|ja` 토글 단일 템플릿
- `_workspace/posters/poster-ko.png` — 1080×1350 (한국어판)
- `_workspace/posters/poster-ja.png` — 1080×1350 (일본어판)

## 야경 컷 선정
후보 6컷(namsan_69/33/30/44/22/29)을 Read로 육안 비교.
- namsan_33: 주간 야외 → 부적합(밝음)
- namsan_30/22/29: 실내 레스토랑(따뜻한 톤) → 부적합
- namsan_44: 실내 형광등 → 부적합
- **namsan_69 채택**: 유일한 야간 도시 전경. 어두운 하늘 + 서울 야경 불빛, 남산 일대가 보이고 상하단에 텍스트 얹을 어두운 여백 충분, 두 아티스트가 위를 올려다보는 구도로 감정선도 일치.

배경 경로: `/Users/hwang-gyeongha/mariko_yukie/public/images/namsan_69.webp`

## 캡처 환경
- Playwright MCP가 `file://` 프로토콜을 차단 → 프로젝트 루트에 `python3 -m http.server`(포트 8731) 정적 서버를 띄우고 `http://localhost:8731/...`로 로드. 캡처 동안만 HTML 내 이미지 src 3곳을 루트 기준 절대 경로로 임시 변경했고, 캡처 완료 후 계획서 규약(이미지 참조는 절대 `file://`)대로 `file:///Users/hwang-gyeongha/mariko_yukie/...` 경로로 되돌려 커밋했다. 즉 커밋된 `poster.html`은 `file://` 기준이라 브라우저로 직접 열면 렌더되고, 재캡처 시에는 다시 HTTP 서버+루트경로로 잠시 바꿔야 함.
- 뷰포트 1080×1350 고정, 폰트/webp 디코드 위해 ~1.5초 대기 후 캡처. 최종 PNG 모두 `1080 x 1350` 확인.

## 계획 대비 조정 내용
1. 앨범 커버 620→560px, content padding/마진 소폭 축소 — 정보+CTA 텍스트 블록이 두꺼워 세로 오버플로 방지.
2. **CTA URL 클리핑 수정(검수 1차 발견)**: 초기 캡처에서 `tumblbug.com/marikoanduki…`가 카드 우측에서 잘림. `.url` 22px + `white-space:nowrap`로 카드가 내용 폭에 맞춰 늘어나도록 수정 → 전체 URL 노출 확인.
3. 일본어판 ribbon 31px, title(Mochiy Pop One) 80px로 축소 — 일본어 카피가 더 길어 박스 넘침 방지.

## 최종 육안 검수 결과
- ko/ja 동일 레이아웃·동등 톤. 발매월 2026.9 정확. QR 목적지 일치.
- 앨범 커버 또렷, 중앙 비잘림. 제목/정보 야경 위 대비 충분(상하단 그라데이션 오버레이).
- QR 파인더 패턴 3개 모서리 또렷 — 스캔성 양호. CTA 카드/리본 프레임 내 안착, 넘침 없음.
- 폰트 정상: ko 제목 Bagel Fat One·본문 Gowun Dodum·강조 Jua / ja 제목 Mochiy Pop One·본문 Zen Maru Gothic. 깨짐 없음.
- 70년대 사이키델릭·큐트 톤(앨범 커버 무지개 프레임 + 코랄 리본 + 옐로 별)이 야경 위에서 살아있음.

## 개정 (이중 타이틀 해소, 재캡처)
- 피드백 반영: 커버가 이미 대형 "남산타워/南山タワー" 타이틀+아티스트명을 담고 있어 하단 대형 `.title` 줄을 **제거**.
- `.album-line`을 작은 보조 캡션(ko 27px·ja 25px)으로 재정의, 앨범명 가볍게 포함: ko `마리코 & 사토유키에 1st Album 《남산타워》`, ja `マリコ & サトユキエ 1st Album 《南山タワー》`.
- 제목 제거로 생긴 여백은 `.info` 30→33px, `.cta` margin-top 30→40px, album-line 하단 22px로 배분 → 하단 호흡 개선. 발매정보·CTA·핸들 유지.
- ko/ja 재캡처·재검수: 균형 양호, 가독성·넘침 없음, 두 벌 동등 톤 확인.

## 남은 우려
- 특이사항 없음(이중 타이틀 해소됨). QR은 화면상 또렷하나 게시 전 실측 스캔 1회 권장(목적지 URL 검증 완료).

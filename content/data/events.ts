import type { EventItem } from "./types";

// ── 공연·소식 ──
export const events: EventItem[] = [
  {
    id: "release-show-2026",
    type: "release",
    title: { ko: "《남산타워》 발매 기념공연", ja: "《南山タワー》リリース記念公演", en: "'Namsan Tower Lights' Release Show" },
    dateLabel: { ko: "2026년 9월 6일 (일) 오후 5시", ja: "2026年9月6日(日)17:00", en: "Sun, Sep 6, 2026 · 5 PM" },
    venue: { ko: "스페이스 한강 (서울)", ja: "スペース・ハンガン(ソウル)", en: "Space Hangang, Seoul" },
    note: { ko: "후원자 초청제로 진행되는 무료 공연입니다.", ja: "支援者招待制の無料公演です。", en: "A free, backers-invited show." },
    status: "confirmed",
  },
  {
    id: "tour-2026",
    type: "tour",
    title: { ko: "국내 지방 투어 (검토 중)", ja: "国内地方ツアー(検討中)", en: "Domestic regional tour (under review)" },
    dateLabel: { ko: "2026년 9~10월", ja: "2026年9〜10月", en: "Sept–Oct 2026" },
    venue: { ko: "대구 등 약 5개 도시", ja: "大邱など約5都市", en: "~5 cities incl. Daegu" },
    note: { ko: "펀딩 성과와 마리코 동행 가능 여부에 따라 확정됩니다.", ja: "ファンディングの成果とマリコの同行可否により確定します。", en: "To be confirmed depending on funding results and Mariko's availability." },
    status: "tentative",
  },
];

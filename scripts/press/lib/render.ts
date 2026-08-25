import type { Contact } from "./contacts";
import { groundingFor } from "./grounding";
import { ENGLISH_RECIPIENTS } from "./decisions";
import type { Segment } from "./segment";

export type Recipient = Contact & { segment: Segment; opener: string };

export const FROM = "마리코 & 유키에 <noreply@alf.seoul.kr>";
export const REPLY_TO = "hwangtab@gmail.com";

export const SUBJECTS = {
  A: "일본인 둘이 서울에서 만든 한국어 앨범 《남산타워》 — 9월 4일 발매",
  B: "《남산타워》 앨범 소개 — 마리코 & 유키에 (한국어 10곡, 일본어 5곡)",
} as const;

export const SUBJECT_EN =
  "Two Japanese musicians in Seoul, singing in Korean — 'Namsan Tower Lights', out Sept 4";

export function isEnglish(email: string): boolean {
  return ENGLISH_RECIPIENTS.has(email.toLowerCase());
}

const WHY_EN =
  "Sato Yukie came to Seoul in 1995, bought a Shin Joong-hyun LP at a record shop, and never left; he has spent thirty years digging into Korean rock. Mariko found Korea through its TV dramas, went on KBS's national singing contest, and debuted as a trot singer.\n\nThe two of them made a record in Korean about living in Seoul. The Korean and Japanese lyrics are not translations of each other — each is its own original. In \"Cup of Love\", the word \"yeobo-yeobo\" means \"darling\" in Korean and describes an old person's frailty in Japanese. One word, working in both languages at once.";

const FACTS_EN = [
  "'Namsan Tower Lights' (《남산타워》) — Mariko & Yukie",
  "15 tracks: 10 in Korean, 5 in Japanese",
  "Out September 4, 2026 · CD limited to 500 copies + digital",
  "Release show: Sun, Sept 6, 5 PM — Space Hangang, Seoul",
];

/**
 * 관계나 과거 행위를 주장하는 표현.
 *
 * 평론가 바닥은 좁아서 지어낸 문장 하나가 하루면 돈다. 문장 형태가 다양해
 * 화이트리스트로는 열거가 불가능하므로, 위험한 주장 유형을 막는다.
 */
const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  {
    pattern: /지난번|지난\s*기사|전에\s*쓰신|쓰신\s*(글|기사|리뷰)|읽었습니다|읽어\s*보았|보았습니다|접했습니다/,
    why: "과거 저작물을 읽었다는 주장",
  },
  {
    pattern: /뵈었을|뵀을|만나\s*뵈|인사드린\s*적|오랜만|다시\s*연락|전에\s*연락|기억하실/,
    why: "기존 관계 주장",
  },
  { pattern: /약속드립니다|독점|단독\s*제공|보장(?:합니다|해)/, why: "지킬 수 없는 약속" },
  { pattern: /팬입니다|애독|늘\s*챙겨\s*보|즐겨\s*듣/, why: "확인 불가능한 친밀감 주장" },
];

/**
 * 도입부가 근거 없는 사실을 말하는지 본다.
 *
 * 두 가지를 잡는다. 하나는 위 FORBIDDEN 유형이고, 다른 하나는 이메일 도메인이
 * 부정하는 매체명이다. 후자가 중요한 이유는 문화부 리스트의 소속 칸이
 * 이름·주소와 무관하게 흘러가는 나열이기 때문이다 — 그대로 믿고 쓰면
 * "중앙일보의 임진모 선생님께" 같은 틀린 메일이 나간다.
 *
 * 여기서 잡히지 않는 것도 있다. 리스트에 없는 매체명을 새로 지어내는 경우다.
 * 그래서 openers.csv 사람 검수가 두 번째 방어선으로 반드시 필요하다.
 */
export function findUnsourcedClaims(opener: string, contact: Contact): string[] {
  const found: string[] = [];

  for (const { pattern, why } of FORBIDDEN) {
    const match = opener.match(pattern);
    if (match) found.push(`${why}: "${match[0]}"`);
  }

  for (const outlet of groundingFor(contact).forbiddenOutlets) {
    if (opener.includes(outlet)) {
      found.push(`주소가 부정하는 매체명: "${outlet}"`);
    }
  }

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
    "사토유키에는 1995년 서울의 한 음반 가게에서 신중현과 엽전들의 LP를 산 뒤 여기 눌러앉아 곱창전골을 만든 사람이고, 마리코는 한국 드라마로 시작해 KBS 전국노래자랑을 거쳐 트로트로 데뷔한 사람입니다. 그 둘이 서울 생활에서 나온 이야기를 한국어로 부른 음반입니다.\n\n두 언어는 번역 관계가 아니라 각각의 원본입니다. 「사랑의 술잔」의 “여보여보”는 한국어에서 배우자를 부르는 말이고 일본어에서는 노인의 모습을 그리는 의태어인데, 이 한 단어가 음반이 선 자리를 그대로 보여줍니다.",
  "music-press":
    "사토유키에는 1995년 서울의 음반 가게에서 신중현과 엽전들의 LP를 산 뒤 눌러앉아 밴드 곱창전골을 만든 사람이고, 마리코는 한국 드라마로 한국을 알게 돼 KBS 전국노래자랑을 거쳐 트로트로 데뷔한 사람입니다. 두 사람이 함께 활동한 지 여덟 해째입니다.\n\n관광객의 시선이 아니라 서울이 이미 집이 된 사람들의 시선이라, 남산타워가 명소가 아니라 동네 랜드마크로 등장합니다. 한일 문화교류를 늘 이야기하지만 이 방향의 사례는 드뭅니다.",
  "culture-desk":
    "사토유키에는 1995년 서울에 와 신중현과 엽전들의 LP를 만난 뒤 30년째 여기 살고 있고, 마리코는 한국 드라마로 한국을 알게 돼 KBS 전국노래자랑을 거쳐 트로트 가수가 됐습니다.\n\n한일 문화교류를 이야기할 때는 대개 한국에서 밖으로 나가는 방향을 보게 되는데, 이 음반은 반대 방향입니다. 기획이 아니라 두 사람의 서울 생활에서 그대로 나온 노래들입니다.",
  "generic-desk":
    "서울에 사는 일본인 두 사람이 한국어로 만든 15트랙 음반이 9월 4일 발매됩니다.",
  "art-press":
    "서울에 사는 일본인 두 사람이 한국어로 만든 15트랙 음반이 9월 4일 발매됩니다.",
  unknown:
    "서울에 사는 일본인 두 사람이 한국어로 만든 15트랙 음반이 9월 4일 발매됩니다.",
};

const FACTS = [
  "앨범 《남산타워》 (Namsan Tower Lights) — 마리코 & 유키에",
  "15트랙 (한국어 10곡, 일본어 5곡)",
  "2026년 9월 4일 발매 · CD 500장 한정 + 디지털",
  "9월 6일(일) 오후 5시 발매 기념공연 — 스페이스 한강(서울)",
];

export function renderEmail({
  recipient,
  pressUrl,
  subject,
}: {
  recipient: Recipient;
  pressUrl: string;
  subject?: string;
}): { subject: string; html: string; text: string } {
  const opener = recipient.opener.trim();
  if (!opener) throw new Error(`opener is empty for ${recipient.email}`);

  const english = isEnglish(recipient.email);
  if (english) {
    return renderEnglish({ recipient, opener, pressUrl: pressUrl.replace("/ko/", "/en/") });
  }

  const resolvedSubject = subject ?? SUBJECTS.A;
  const why = WHY_IT_MATTERS[recipient.segment];

  const text = [
    opener,
    "",
    why,
    "",
    ...FACTS.map((fact) => `· ${fact}`),
    "",
    "전곡 듣기 · 가사 · 고해상 재킷 · 크레딧을 한 페이지에 모아두었습니다.",
    pressUrl,
    "",
    "필요하신 자료가 더 있으면 이 메일에 그대로 회신해 주세요.",
    "",
    "마리코 & 유키에",
    "수신을 원치 않으시면 이 메일에 회신해 주시면 됩니다.",
  ].join("\n");

  const html = `<div style="font-family:${FONT};max-width:600px;margin:0 auto;color:#1a1a1a;font-size:15px;line-height:1.8;">
  <p style="margin:0 0 18px;">${esc(opener).replace(/\n/g, "<br>")}</p>
  ${why.split("\n\n").map((para) => `<p style="margin:0 0 18px;">${esc(para)}</p>`).join("\n  ")}
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

  return { subject: resolvedSubject, html, text };
}

function renderEnglish({
  opener,
  pressUrl,
}: {
  recipient: Recipient;
  opener: string;
  pressUrl: string;
}): { subject: string; html: string; text: string } {
  const text = [
    opener,
    "",
    WHY_EN,
    "",
    ...FACTS_EN.map((fact) => `· ${fact}`),
    "",
    "Every track streams on one page, along with lyrics, credits and high-resolution artwork.",
    pressUrl,
    "",
    "Just reply to this message if you need anything else.",
    "",
    "Mariko & Yukie",
    "If you would rather not hear from us, a reply saying so is enough.",
  ].join("\n");

  const html = `<div style="font-family:${FONT};max-width:600px;margin:0 auto;color:#1a1a1a;font-size:15px;line-height:1.8;">
  <p style="margin:0 0 18px;">${esc(opener)}</p>
  ${WHY_EN.split("\n\n").map((para) => `<p style="margin:0 0 18px;">${esc(para)}</p>`).join("\n  ")}
  <ul style="margin:0 0 18px;padding-left:18px;">
    ${FACTS_EN.map((fact) => `<li style="margin-bottom:4px;">${esc(fact)}</li>`).join("\n    ")}
  </ul>
  <p style="margin:0 0 8px;">Every track streams on one page, along with lyrics, credits and high-resolution artwork.</p>
  <p style="margin:0 0 24px;"><a href="${esc(pressUrl)}" style="color:#c2410c;font-weight:700;">${esc(pressUrl)}</a></p>
  <p style="margin:0 0 24px;">Just reply to this message if you need anything else.</p>
  <p style="margin:0;color:#111;">Mariko &amp; Yukie</p>
  <p style="margin:16px 0 0;font-size:12px;color:#999;">If you would rather not hear from us, a reply saying so is enough.</p>
</div>`;

  return { subject: SUBJECT_EN, html, text };
}

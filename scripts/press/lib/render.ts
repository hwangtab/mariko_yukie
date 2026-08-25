import { tracks } from "@/lib/content";
import type { Contact } from "./contacts";
import { groundingFor } from "./grounding";
import { ENGLISH_RECIPIENTS } from "./decisions";
import type { Segment } from "./segment";

export type Recipient = Contact & { segment: Segment; opener: string };

export const FROM = "마리코 & 유키에 <noreply@alf.seoul.kr>";
export const REPLY_TO = "hwangtab@gmail.com";

const SITE = "https://marikoyukie.vercel.app";
const COVER = `${SITE}/press/email-cover.jpg`;
const MV_ID = "bWIwjnij0XQ";
const MV_URL = `https://www.youtube.com/watch?v=${MV_ID}`;
const MV_THUMB = `https://img.youtube.com/vi/${MV_ID}/maxresdefault.jpg`;

export const SUBJECTS = {
  A: "일본인 둘이 서울에서 만든 한국어 앨범 《남산타워》 — 9월 4일 발매",
  B: "《남산타워》 앨범 소개 — 마리코 & 유키에 (한국어 10곡, 일본어 5곡)",
} as const;

export const SUBJECT_EN =
  "Two Japanese musicians in Seoul, singing in Korean — 'Namsan Tower Lights', out Sept 4";

export function isEnglish(email: string): boolean {
  return ENGLISH_RECIPIENTS.has(email.toLowerCase());
}

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
 * 부정하는 매체명이다. 후자가 없으면 문화부 리스트의 나열을 그대로 믿고
 * "중앙일보의 임진모 선생님께" 같은 틀린 메일이 나간다.
 *
 * 여기서 못 잡는 것도 있다 — 리스트에 없는 매체명을 새로 지어내는 경우다.
 * 그래서 openers.csv 사람 검수가 두 번째 방어선으로 반드시 필요하다.
 */
export function findUnsourcedClaims(opener: string, contact: Contact): string[] {
  const found: string[] = [];

  for (const { pattern, why } of FORBIDDEN) {
    const match = opener.match(pattern);
    if (match) found.push(`${why}: "${match[0]}"`);
  }

  for (const outlet of groundingFor(contact).forbiddenOutlets) {
    if (opener.includes(outlet)) found.push(`주소가 부정하는 매체명: "${outlet}"`);
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

// 본문 — humanize-korean v1.5 윤문본 (_workspace/2026-08-26-001)
const BODY_CRITIC = [
  "사토유키에는 1995년 서울의 한 음반 가게에서 신중현과 엽전들의 LP를 샀습니다. 그 길로 눌러앉아 곱창전골을 만들었습니다. 마리코는 한국 드라마로 시작해 KBS 전국노래자랑을 거쳐 트로트로 데뷔했습니다. 그 둘이 서울 생활에서 나온 이야기를 한국어로 부른 음반입니다.",
  "두 언어는 번역 관계가 아니라 각각의 원본입니다. 「사랑의 술잔」의 “여보여보”는 한국어에서 배우자를 부르는 말이고 일본어에서는 노인의 모습을 그리는 의태어입니다. 이 한 단어가 음반이 선 자리를 그대로 보여줍니다.",
];
const BODY_MUSIC = [
  "사토유키에는 1995년 서울의 음반 가게에서 신중현과 엽전들의 LP를 산 뒤 눌러앉아 밴드 곱창전골을 만들었습니다. 마리코는 한국 드라마로 한국을 알게 돼 KBS 전국노래자랑을 거쳐 트로트로 데뷔했습니다. 두 사람이 함께 활동한 지 여덟 해째입니다.",
  "관광객의 시선이 아니라 서울이 이미 집이 된 사람들의 시선이라 남산타워가 명소가 아니라 동네 랜드마크로 등장합니다. 한일 문화교류를 늘 이야기하지만 이 방향의 사례는 드뭅니다.",
];
const BODY_CULTURE = [
  "사토유키에는 1995년 서울에 와 신중현과 엽전들의 LP를 만난 뒤 30년째 여기 삽니다. 마리코는 한국 드라마로 한국을 알게 돼 KBS 전국노래자랑을 거쳐 트로트 가수가 됐습니다.",
  "한일 문화교류를 이야기할 때는 대개 한국에서 밖으로 나가는 방향을 떠올립니다. 이 음반은 반대 방향입니다. 기획이 아니라 두 사람의 서울 생활에서 그대로 나온 노래들입니다.",
];

const BODY: Record<Segment, string[]> = {
  critic: BODY_CRITIC,
  "music-press": BODY_MUSIC,
  "culture-desk": BODY_CULTURE,
  "generic-desk": BODY_CULTURE,
  "art-press": BODY_CULTURE,
  unknown: BODY_CULTURE,
};

const CLOSING = {
  page: "전곡 듣기, 가사, 고해상 재킷, 크레딧을 한 페이지에 모아두었습니다.",
  reply: "필요하신 자료가 더 있으면 이 메일에 그대로 회신해 주세요.",
  optout: "수신을 원치 않으시면 회신으로 알려 주시면 됩니다.",
};

const FACTS = [
  ["발매", "2026년 9월 4일"],
  ["구성", "15트랙 — 한국어 10곡, 일본어 5곡"],
  ["포맷", "CD 500장 한정(12쪽 한·일 가사 부클릿) + 디지털"],
  ["발매공연", "9월 6일(일) 오후 5시 · 스페이스 한강(서울)"],
];

const FACTS_EN = [
  ["Release", "September 4, 2026"],
  ["Format", "15 tracks — 10 in Korean, 5 in Japanese"],
  ["Physical", "CD limited to 500 copies (12p KR/JP lyric booklet) + digital"],
  ["Release show", "Sun, Sept 6, 5 PM · Space Hangang, Seoul"],
];

const WHY_EN = [
  "Sato Yukie came to Seoul in 1995, bought a Shin Joong-hyun LP at a record shop, and never left. He started the band Kopchangjeongol and has spent thirty years digging into Korean rock. Mariko found Korea through its TV dramas, went on KBS's national singing contest, and debuted as a trot singer.",
  "The Korean and Japanese lyrics are not translations of each other — each is its own original. In “Cup of Love”, the word “yeobo-yeobo” means “darling” in Korean and describes an old person's frailty in Japanese. One word, working in both languages at once.",
];

function trackRows(locale: "ko" | "en"): string {
  return tracks
    .map((track) => {
      const title = locale === "ko" ? track.title.ko : track.title.en;
      return `<tr>
        <td style="padding:5px 10px 5px 0;font-size:13px;color:#9a9a9a;width:26px;vertical-align:top;">${String(track.number).padStart(2, "0")}</td>
        <td style="padding:5px 0;font-size:14px;color:#2a2a2a;">${esc(title)}${track.isTitle ? ' <span style="color:#c2410c;font-size:11px;">TITLE</span>' : ""}</td>
      </tr>`;
    })
    .join("\n      ");
}

function factRows(rows: string[][]): string {
  return rows
    .map(
      ([label, value]) => `<tr>
        <td style="padding:5px 14px 5px 0;font-size:13px;color:#8a8a8a;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
        <td style="padding:5px 0;font-size:14px;color:#2a2a2a;">${esc(value)}</td>
      </tr>`,
    )
    .join("\n      ");
}

function shell({
  opener,
  bodyParagraphs,
  facts,
  labels,
  pressUrl,
  locale,
}: {
  opener: string;
  bodyParagraphs: string[];
  facts: string[][];
  labels: {
    mv: string;
    page: string;
    cta: string;
    reply: string;
    optout: string;
    tracklist: string;
    sign: string;
  };
  pressUrl: string;
  locale: "ko" | "en";
}): string {
  const p = (text: string) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#2a2a2a;">${esc(text)}</p>`;

  return `<div style="background:#f4f2ed;padding:24px 12px;font-family:${FONT};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">
  <tr><td>
    <a href="${esc(pressUrl)}" style="display:block;"><img src="${COVER}" width="600" alt="Namsan Tower Lights" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a>
  </td></tr>

  <tr><td style="padding:26px 34px 0;">
    <div style="font-size:12px;letter-spacing:0.16em;color:#c2410c;text-transform:uppercase;">Mariko &amp; Yukie</div>
    <div style="font-size:26px;font-weight:700;color:#141414;margin-top:6px;line-height:1.25;">${locale === "ko" ? "남산타워" : "Namsan Tower Lights"}</div>
    <div style="font-size:13px;color:#8a8a8a;margin-top:5px;">${locale === "ko" ? "2026년 9월 4일 발매" : "Out September 4, 2026"}</div>
  </td></tr>

  <tr><td style="padding:22px 34px 0;">
    ${p(opener)}
    ${bodyParagraphs.map(p).join("\n    ")}
  </td></tr>

  <tr><td style="padding:6px 34px 0;">
    <a href="${MV_URL}" style="display:block;text-decoration:none;border-radius:8px;overflow:hidden;border:1px solid #e4e1da;">
      <img src="${MV_THUMB}" width="532" alt="Namsan Tower Lights MV" style="display:block;width:100%;height:auto;border:0;">
      <span style="display:block;background:#141414;color:#ffffff;font-family:${FONT};font-size:13px;text-align:center;padding:11px;">&#9654;&nbsp;&nbsp;${esc(labels.mv)}</span>
    </a>
  </td></tr>

  <tr><td style="padding:24px 34px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${factRows(facts)}
    </table>
  </td></tr>

  <tr><td style="padding:22px 34px 0;">
    <div style="font-size:12px;letter-spacing:0.14em;color:#8a8a8a;text-transform:uppercase;border-bottom:1px solid #e4e1da;padding-bottom:7px;">${esc(labels.tracklist)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px;">
      ${trackRows(locale)}
    </table>
  </td></tr>

  <tr><td style="padding:24px 34px 0;">
    ${p(labels.page)}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;">
      <tr><td bgcolor="#c2410c" style="border-radius:7px;">
        <a href="${esc(pressUrl)}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-family:${FONT};font-size:15px;font-weight:700;text-decoration:none;">${esc(labels.cta)}</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 34px 30px;">
    ${p(labels.reply)}
    <div style="font-size:15px;color:#141414;margin-top:14px;">${esc(labels.sign)}</div>
    <div style="margin-top:18px;padding-top:14px;border-top:1px solid #eeebe4;font-size:12px;color:#a5a5a5;line-height:1.7;">
      ${esc(labels.optout)}<br>${esc(pressUrl)}
    </div>
  </td></tr>
</table>
</div>`;
}

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

  if (isEnglish(recipient.email)) {
    const enUrl = pressUrl.replace("/ko/", "/en/");
    const text = [
      opener,
      "",
      ...WHY_EN,
      "",
      ...FACTS_EN.map(([label, value]) => `· ${label}: ${value}`),
      "",
      `Music video: ${MV_URL}`,
      "",
      "Every track streams on one page, with lyrics, credits and high-resolution artwork.",
      enUrl,
      "",
      "Just reply to this message if you need anything else.",
      "",
      "Mariko & Yukie",
      "If you would rather not hear from us, a reply saying so is enough.",
    ].join("\n");

    return {
      subject: SUBJECT_EN,
      text,
      html: shell({
        opener,
        bodyParagraphs: WHY_EN,
        facts: FACTS_EN,
        labels: {
          mv: "Watch the music video on YouTube",
          page: "Every track streams on one page, with lyrics, credits and high-resolution artwork.",
          cta: "Open the press kit",
          reply: "Just reply to this message if you need anything else.",
          optout: "If you would rather not hear from us, a reply saying so is enough.",
          tracklist: "Tracklist",
          sign: "Mariko & Yukie",
        },
        pressUrl: enUrl,
        locale: "en",
      }),
    };
  }

  const bodyParagraphs = BODY[recipient.segment];
  const text = [
    opener,
    "",
    ...bodyParagraphs,
    "",
    ...FACTS.map(([label, value]) => `· ${label}: ${value}`),
    "",
    `뮤직비디오: ${MV_URL}`,
    "",
    CLOSING.page,
    pressUrl,
    "",
    CLOSING.reply,
    "",
    "마리코 & 유키에",
    CLOSING.optout,
  ].join("\n");

  return {
    subject: subject ?? SUBJECTS.A,
    text,
    html: shell({
      opener,
      bodyParagraphs,
      facts: FACTS,
      labels: {
        mv: "유튜브에서 뮤직비디오 보기",
        page: CLOSING.page,
        cta: "프레스킷 열기",
        reply: CLOSING.reply,
        optout: CLOSING.optout,
        tracklist: "수록곡",
        sign: "마리코 & 유키에",
      },
      pressUrl,
      locale: "ko",
    }),
  };
}

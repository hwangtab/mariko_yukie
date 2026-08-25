/**
 * 사용법:
 *   pnpm tsx scripts/press/render.ts
 *
 * 입력: private/recipients.json
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

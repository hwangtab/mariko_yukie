/**
 * 사용법:
 *   pnpm tsx scripts/press/send.ts                          # 드라이런(발송 안 함)
 *   pnpm tsx scripts/press/send.ts --test <이메일>          # 1통 테스트 발송
 *   pnpm tsx scripts/press/send.ts --send --limit 25        # 실제 발송, 상한 25통
 *   pnpm tsx scripts/press/send.ts --send --segment critic --limit 25
 *
 * 입력: private/recipients.json
 * 로그: private/send-log.jsonl (이미 보낸 주소는 자동으로 건너뛴다)
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { findUnsourcedClaims, renderEmail, type Recipient } from "./lib/render";
import { loadSentAddresses, sendOne } from "./lib/transport";
import { normalizeName } from "./lib/duplicates";
import { DISTINCT_PEOPLE } from "./lib/decisions";

const DELAY_MS = 600;
const LOG_PATH = join(process.cwd(), "private/send-log.jsonl");
const PRESS_URL = process.env.PRESS_URL ?? "https://marikoyukie.vercel.app/ko/press";

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const mode = args.includes("--send") ? "send" : args.includes("--test") ? "test" : "preview";
const testEmail = flag("--test");
const limit = Number(flag("--limit") ?? Number.POSITIVE_INFINITY);
const segment = flag("--segment");

function loadEnv(): void {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!match) continue;
    process.env[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/s, "$2");
  }
}

/** 메일은 배포된 프레스 페이지를 링크한다. 배포 전에 보내면 기자가 404를 만난다. */
async function verifyPressPage(): Promise<void> {
  const response = await fetch(PRESS_URL, { method: "HEAD" }).catch(() => null);
  if (!response || !response.ok) {
    console.error(`\n발송 중단: 프레스 페이지에 접근할 수 없습니다 — ${PRESS_URL}`);
    console.error("   배포를 먼저 끝내고 다시 실행하세요.\n");
    process.exit(1);
  }
  console.log(`프레스 페이지 확인 ✓ ${PRESS_URL}`);
}

async function main(): Promise<void> {
  loadEnv();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && mode !== "preview") {
    console.error("오류: RESEND_API_KEY가 .env.local에 없습니다 (alf 레포에서 복사)");
    process.exit(1);
  }

  const all: Recipient[] = JSON.parse(
    readFileSync(join(process.cwd(), "private/recipients.json"), "utf8"),
  );

  const problems = all.flatMap((recipient) =>
    findUnsourcedClaims(recipient.opener, recipient).map((claim) => `${recipient.email} — ${claim}`),
  );
  if (problems.length > 0) {
    console.error(`\n근거 없는 개인화 ${problems.length}건. 발송을 막습니다.`);
    for (const problem of problems) console.error(`  ✗ ${problem}`);
    process.exit(1);
  }

  // 주소가 달라도 같은 사람에게 두 번 가면 스팸이다. 검수를 통과했더라도
  // 이름이 겹치는 채로 남아 있으면 발송 직전에 다시 막는다.
  const byName = new Map<string, string[]>();
  for (const recipient of all) {
    const key = normalizeName(recipient.name);
    if (!key || key === "-") continue;
    byName.set(key, [...(byName.get(key) ?? []), recipient.email]);
  }
  // 이름은 같지만 다른 사람으로 판단해 둘 다 남긴 행은 통과시킨다.
  const allowed = new Set(
    DISTINCT_PEOPLE.map((person) => `${normalizeName(person.name)}|${[...person.emails].sort().join(",")}`),
  );
  const stillDuplicated = [...byName.entries()].filter(
    ([name, emails]) => emails.length > 1 && !allowed.has(`${name}|${[...emails].sort().join(",")}`),
  );
  if (stillDuplicated.length > 0) {
    console.error(`\n같은 이름이 여러 주소로 남아 있습니다 (${stillDuplicated.length}그룹).`);
    for (const [name, emails] of stillDuplicated) {
      console.error(`  ✗ ${name}: ${emails.join(", ")}`);
    }
    console.error("\n같은 사람이면 openers.csv에서 한 줄만 남기세요.");
    console.error("정말 다른 사람이면 이름을 구분되게 적으면 통과합니다.\n");
    process.exit(1);
  }

  const sent = loadSentAddresses(LOG_PATH);
  const queue = all
    .filter((recipient) => !sent.has(recipient.email.toLowerCase()))
    .filter((recipient) => !segment || recipient.segment === segment)
    .slice(0, limit);

  console.log(`\n전체 ${all.length}명 · 발송 완료 ${sent.size}명 · 이번 대상 ${queue.length}명`);
  if (segment) console.log(`세그먼트 필터: ${segment}`);

  if (mode === "preview") {
    for (const recipient of queue.slice(0, 10)) {
      console.log(`  ${recipient.segment.padEnd(13)} ${recipient.email}  ${recipient.name}`);
    }
    if (queue.length > 10) console.log(`  ... 외 ${queue.length - 10}명`);
    console.log("\n실제 발송: --send --limit N   /   테스트 1통: --test <이메일>\n");
    return;
  }

  await verifyPressPage();

  if (mode === "test") {
    const sample = queue[0] ?? all[0];
    const { subject, html, text } = renderEmail({ recipient: sample, pressUrl: PRESS_URL });
    const result = await sendOne({
      apiKey: apiKey!,
      to: testEmail!,
      subject: `[테스트] ${subject}`,
      html,
      text,
    });
    console.log(result.ok ? `테스트 발송 완료 ✓ ${result.id}` : `실패: ${result.error}`);
    process.exit(result.ok ? 0 : 1);
  }

  console.log(`\n${queue.length}명에게 실제로 발송합니다. 되돌릴 수 없습니다.`);
  console.log('진행하려면 "보내기"를 입력하세요 (취소: 그냥 Enter):');

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise<string>((resolve) => {
    rl.question("> ", (value) => {
      rl.close();
      resolve(value.trim());
    });
  });
  if (answer !== "보내기") {
    console.log("취소됐습니다.");
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const [index, recipient] of queue.entries()) {
    const { subject, html, text } = renderEmail({ recipient, pressUrl: PRESS_URL });
    process.stdout.write(`  [${index + 1}/${queue.length}] ${recipient.email} ... `);

    const result = await sendOne({ apiKey: apiKey!, to: recipient.email, subject, html, text });

    appendFileSync(
      LOG_PATH,
      `${JSON.stringify({
        email: recipient.email,
        segment: recipient.segment,
        ok: result.ok,
        id: result.id,
        error: result.error,
        at: new Date().toISOString(),
      })}\n`,
      "utf8",
    );

    if (result.ok) {
      ok++;
      console.log("완료 ✓");
    } else {
      fail++;
      console.log(`실패 (${result.error})`);
    }

    if (index < queue.length - 1) await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }

  console.log(`\n성공 ${ok}건 · 실패 ${fail}건`);
  if (fail > 0) {
    console.log("실패한 주소는 로그에 ok:false로 남아 다음 실행에서 자동 재시도됩니다.");
  }
}

main().catch((error: unknown) => {
  console.error("오류:", error instanceof Error ? error.message : error);
  process.exit(1);
});

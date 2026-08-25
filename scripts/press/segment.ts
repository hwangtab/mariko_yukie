/**
 * 사용법:
 *   pnpm tsx scripts/press/segment.ts
 *
 * 입력: private/contacts.json
 * 산출물: private/segments.csv — 스프레드시트로 열어 눈으로 검수한다.
 *         include 열이 y인 행만 실제 발송 대상이 된다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { toCsv } from "./lib/csv";
import type { Contact } from "./lib/contacts";
import { classify, SEGMENT_ORDER, WAVE_ONE, type Segment } from "./lib/segment";
import { checkOutlet } from "./lib/outlet";

const contacts: Contact[] = JSON.parse(
  readFileSync(join(process.cwd(), "private/contacts.json"), "utf8"),
);

const tagged = contacts
  .map((contact) => ({ contact, segment: classify(contact) }))
  .sort((a, b) => SEGMENT_ORDER.indexOf(a.segment) - SEGMENT_ORDER.indexOf(b.segment));

const rows = [
  ["segment", "name", "role", "email", "outlet_warning", "include"],
  ...tagged.map(({ contact, segment }) => {
    const { contradicted, actual } = checkOutlet(contact);
    const warning = contradicted.length
      ? `역할이 말하는 ${contradicted.join("·")} ≠ 주소가 말하는 ${actual ?? "개인/기타"}`
      : "";
    return [
      segment,
      contact.name,
      contact.role,
      contact.email,
      warning,
      WAVE_ONE.includes(segment) ? "y" : "n",
    ];
  }),
];

const out = join(process.cwd(), "private/segments.csv");
writeFileSync(out, toCsv(rows), "utf8");

const counts = new Map<Segment, number>();
for (const { segment } of tagged) counts.set(segment, (counts.get(segment) ?? 0) + 1);
for (const segment of SEGMENT_ORDER) {
  console.log(`${segment.padEnd(14)} ${counts.get(segment) ?? 0}`);
}

const waveOne = rows.slice(1).filter((row) => row[5] === "y");
const warned = waveOne.filter((row) => row[4]).length;
console.log(`\n1차 대상(include=y): ${waveOne.length}명`);
console.log(`그중 소속-주소 불일치 경고: ${warned}명 — 개인화 문장에 매체명을 쓰면 안 되는 행들`);
console.log(`→ ${out}`);
console.log("스프레드시트로 열어 include 열을 손보세요. 이 검수가 유일한 오발송 방어선입니다.");

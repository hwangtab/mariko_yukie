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
import { groundingFor } from "./lib/grounding";
import { normalizeName, sameNameGroups } from "./lib/duplicates";

const contacts: Contact[] = JSON.parse(
  readFileSync(join(process.cwd(), "private/contacts.json"), "utf8"),
);

const tagged = contacts
  .map((contact) => ({ contact, segment: classify(contact) }))
  .sort((a, b) => SEGMENT_ORDER.indexOf(a.segment) - SEGMENT_ORDER.indexOf(b.segment));

const inWave = tagged.filter(({ segment }) => WAVE_ONE.includes(segment));
const duplicateGroups = sameNameGroups(inWave.map(({ contact }) => contact));

const rows = [
  [
    "segment",
    "name",
    "email",
    "grounded_role",
    "verified_outlet",
    "never_mention",
    "same_person_as",
    "raw_role",
    "include",
  ],
  ...tagged.map(({ contact, segment }) => {
    const g = groundingFor(contact);
    const siblings = (duplicateGroups.get(normalizeName(contact.name)) ?? []).filter(
      (email) => email !== contact.email,
    );
    return [
      segment,
      g.name,
      contact.email,
      g.statedRole,
      g.verifiedOutlet ?? "",
      g.forbiddenOutlets.join("·"),
      siblings.join(" · "),
      contact.role,
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

const waveOne = rows.slice(1).filter((row) => row[8] === "y");
const forbidden = waveOne.filter((row) => row[5]).length;
const noGround = waveOne.filter((row) => !row[3] && !row[4]).length;
const dupRows = waveOne.filter((row) => row[6]).length;
console.log(`\n1차 대상(include=y): ${waveOne.length}명`);
console.log(`  언급 금지 매체가 있는 행: ${forbidden}명`);
console.log(`  개인화 근거가 이름뿐인 행: ${noGround}명 — 매체·역할을 언급하지 않는 도입부로 쓴다`);
console.log(`  같은 이름이 다른 주소로 또 있는 행: ${dupRows}명 (${duplicateGroups.size}그룹)`);
console.log("    → 같은 사람이면 한 주소만 남기세요. 주소가 달라도 두 통이 가면 스팸입니다.");
console.log(`→ ${out}`);
console.log("스프레드시트로 열어 include 열을 손보세요. 이 검수가 유일한 오발송 방어선입니다.");

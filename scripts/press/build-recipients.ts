/**
 * 사용법:
 *   pnpm tsx scripts/press/build-recipients.ts --skeleton   # openers.csv 뼈대 생성
 *   pnpm tsx scripts/press/build-recipients.ts              # openers.csv → recipients.json
 *
 * 뼈대는 segments.csv에서 include=y인 행만 담는다. opener 열은 비어 있고,
 * 채운 뒤 두 번째 형태로 다시 실행한다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsv, toCsv } from "./lib/csv";
import type { Recipient } from "./lib/render";
import type { Segment } from "./lib/segment";

const root = process.cwd();
const skeleton = process.argv.includes("--skeleton");

const segmentRows = parseCsv(readFileSync(join(root, "private/segments.csv"), "utf8"));
const header = segmentRows[0];
const col = (name: string) => header.indexOf(name);
const included = segmentRows
  .slice(1)
  .filter((row) => row[col("include")].trim().toLowerCase() === "y");

if (skeleton) {
  const rows = [
    ["segment", "name", "email", "grounded_role", "verified_outlet", "never_mention", "opener"],
    ...included.map((row) => [
      row[col("segment")],
      row[col("name")],
      row[col("email")],
      row[col("grounded_role")],
      row[col("verified_outlet")],
      row[col("never_mention")],
      "",
    ]),
  ];
  const out = join(root, "private/openers.csv");
  writeFileSync(out, toCsv(rows), "utf8");
  console.log(`뼈대 ${rows.length - 1}행 → ${out}`);
  console.log("opener 열을 채운 뒤 --skeleton 없이 다시 실행하세요.");
  process.exit(0);
}

const openerRows = parseCsv(readFileSync(join(root, "private/openers.csv"), "utf8"));
const openerHeader = openerRows[0];
const openerCol = (name: string) => openerHeader.indexOf(name);

const recipients: Recipient[] = [];
const missing: string[] = [];

for (const row of openerRows.slice(1)) {
  const opener = row[openerCol("opener")].trim();
  const email = row[openerCol("email")].trim();
  if (!opener) {
    missing.push(email);
    continue;
  }
  const groundedRole = row[openerCol("grounded_role")].trim();
  recipients.push({
    email,
    name: row[openerCol("name")].trim(),
    role: groundedRole,
    // 개인화 근거는 음악 리스트 원문뿐이다. 문화부 리스트의 소속 칸은
    // 이름·주소와 무관한 나열이라 여기까지 넘어오지 않는다.
    roleBySource: { music: groundedRole },
    sources: ["music"],
    segment: row[openerCol("segment")].trim() as Segment,
    opener,
  });
}

if (missing.length > 0) {
  console.error(`도입부가 비어 있는 행 ${missing.length}건. 채우거나 openers.csv에서 삭제하세요:`);
  for (const email of missing.slice(0, 20)) console.error(`  ✗ ${email}`);
  process.exit(1);
}

const out = join(root, "private/recipients.json");
writeFileSync(out, JSON.stringify(recipients, null, 2), "utf8");
console.log(`수신자 ${recipients.length}명 → ${out}`);

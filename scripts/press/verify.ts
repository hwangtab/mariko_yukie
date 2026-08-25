/**
 * 사용법:
 *   pnpm tsx scripts/press/verify.ts            # 검사만 (변경 없음)
 *   pnpm tsx scripts/press/verify.ts --apply    # segments.csv의 include를 갱신
 *
 * 발송 대상의 도메인이 실제로 메일을 받을 수 있는지 DNS로 확인하고,
 * 중복 결정을 적용한다. 반송은 도메인 평판을 직접 깎으므로, 보내봐야
 * 튕길 주소는 보내기 전에 빼야 한다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { resolveMx } from "node:dns/promises";
import { parseCsv, toCsv } from "./lib/csv";
import { duplicateExclusions, DISTINCT_PEOPLE, FABRICATED, NOT_PRESS, type Exclusion } from "./lib/decisions";

const apply = process.argv.includes("--apply");
const root = process.cwd();
const path = join(root, "private/segments.csv");


async function main(): Promise<void> {
  const rows = parseCsv(readFileSync(path, "utf8"));
  const header = rows[0];
  const col = (name: string) => header.indexOf(name);
  const body = rows.slice(1);

  const included = body.filter((row) => row[col("include")].trim().toLowerCase() === "y");
  const domains = [...new Set(included.map((row) => row[col("email")].split("@")[1].toLowerCase()))];

  console.log(`대상 ${included.length}명 · 고유 도메인 ${domains.length}개 — MX 조회 중...`);

  const deadDomains = new Set<string>();
  await Promise.all(
    domains.map(async (domain) => {
      try {
        const records = await resolveMx(domain);
        if (records.length === 0) deadDomains.add(domain);
      } catch {
        // NXDOMAIN·서버 오류 모두 "지금 이 주소로는 못 보낸다"로 취급한다.
        deadDomains.add(domain);
      }
    }),
  );

  // 아직 발송 대상으로 남아 있는 행만 다룬다. 이미 뺀 것을 계속 보고하면
  // 다시 돌렸을 때 할 일이 남은 것처럼 보인다.
  const stillIncluded = new Set(included.map((row) => row[col("email")].toLowerCase()));
  const exclusions: Exclusion[] = [
    ...included
      .filter((row) => deadDomains.has(row[col("email")].split("@")[1].toLowerCase()))
      .map((row) => ({ email: row[col("email")], reason: "MX 레코드 없음 — 반송된다" })),
    ...duplicateExclusions().filter((exclusion) => stillIncluded.has(exclusion.email.toLowerCase())),
    ...NOT_PRESS.filter((exclusion) => stillIncluded.has(exclusion.email.toLowerCase())),
    ...FABRICATED.filter((exclusion) => stillIncluded.has(exclusion.email.toLowerCase())),
  ];

  const byEmail = new Map(exclusions.map((exclusion) => [exclusion.email.toLowerCase(), exclusion]));

  if (exclusions.length === 0) {
    console.log("\n제외할 주소 없음 — 모든 대상이 MX를 가지고 있고 중복도 정리돼 있습니다.");
  }
  console.log(exclusions.length ? `\n=== 제외 대상 ${exclusions.length}건 ===` : "");
  for (const exclusion of exclusions) {
    const row = body.find((candidate) => candidate[col("email")] === exclusion.email);
    console.log(`  ${(row?.[col("name")] ?? "?").slice(0, 22).padEnd(22)} ${exclusion.email.padEnd(34)} ${exclusion.reason}`);
  }

  console.log(`\n=== 이름은 같지만 다른 사람으로 판단 (둘 다 발송) ===`);
  for (const person of DISTINCT_PEOPLE) {
    console.log(`  ${person.name} — ${person.emails.join(", ")}`);
    console.log(`    ${person.why}`);
  }

  if (!apply) {
    console.log(`\n적용하려면 --apply를 붙이세요. 지금은 아무것도 바꾸지 않았습니다.`);
    return;
  }

  const reasonCol = col("exclude_reason");
  const nextHeader = reasonCol >= 0 ? header : [...header, "exclude_reason"];
  const reasonIndex = reasonCol >= 0 ? reasonCol : nextHeader.length - 1;

  let changed = 0;
  const nextBody = body.map((row) => {
    const next = [...row];
    while (next.length < nextHeader.length) next.push("");
    const exclusion = byEmail.get(next[col("email")].toLowerCase());
    if (exclusion && next[col("include")].trim().toLowerCase() === "y") {
      next[col("include")] = "n";
      next[reasonIndex] = exclusion.reason;
      changed++;
    }
    return next;
  });

  writeFileSync(path, toCsv([nextHeader, ...nextBody]), "utf8");
  const remaining = nextBody.filter((row) => row[col("include")].trim().toLowerCase() === "y").length;
  console.log(`\n${changed}건을 include=n으로 바꿨습니다. 남은 발송 대상: ${remaining}명`);
  console.log(`→ ${path}`);

}

main().catch((error: unknown) => {
  console.error("오류:", error instanceof Error ? error.message : error);
  process.exit(1);
});

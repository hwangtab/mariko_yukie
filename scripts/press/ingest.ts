/**
 * 사용법:
 *   pnpm tsx scripts/press/ingest.ts <문화부CSV> <음악CSV>
 *
 * 산출물: private/contacts.json
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsv } from "./lib/csv";
import { mergeContacts } from "./lib/contacts";

const [culturePath, musicPath] = process.argv.slice(2);
if (!culturePath || !musicPath) {
  console.error("사용법: pnpm tsx scripts/press/ingest.ts <문화부CSV> <음악CSV>");
  process.exit(1);
}

const contacts = mergeContacts([
  { source: "culture", rows: parseCsv(readFileSync(culturePath, "utf8")) },
  { source: "music", rows: parseCsv(readFileSync(musicPath, "utf8")) },
]);

mkdirSync(join(process.cwd(), "private"), { recursive: true });
const out = join(process.cwd(), "private/contacts.json");
writeFileSync(out, JSON.stringify(contacts, null, 2), "utf8");

const bothLists = contacts.filter((contact) => contact.sources.length > 1).length;
console.log(`고유 수신자 ${contacts.length}명 (두 리스트 중복 ${bothLists}명)`);
console.log(`→ ${out}`);

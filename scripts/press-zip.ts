/**
 * 프레스킷 MP3 묶음을 만든다. 로컬에서 한 번 돌려 결과를 커밋한다.
 *
 *   pnpm press:zip
 *
 * public/audio의 15곡을 그대로 쓴다. 곡 순서와 영문 곡명은 content/data/tracks.ts가
 * 이미 갖고 있으므로 여기서 다시 적지 않는다. 압축은 시스템 zip에 맡긴다.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, copyFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { tracks } from "../lib/content";

const FOLDER = "Namsan Tower Lights - Mariko & Yukie";
const OUT = join(process.cwd(), "public/press/namsan-tower-press-kit.zip");

const stage = mkdtempSync(join(tmpdir(), "press-zip-"));
const dir = join(stage, FOLDER);
mkdirSync(dir);

for (const track of tracks) {
  const n = String(track.number).padStart(2, "0");
  copyFileSync(
    join(process.cwd(), "public/audio", `${track.slug}.mp3`),
    join(dir, `${n} ${track.title.en}.mp3`),
  );
}
copyFileSync(join(process.cwd(), "public/press/email-cover.jpg"), join(dir, "cover.jpg"));

rmSync(OUT, { force: true });
mkdirSync(join(process.cwd(), "public/press"), { recursive: true });
execFileSync("zip", ["-X", "-0", "-q", "-r", OUT, FOLDER], { cwd: stage });
rmSync(stage, { recursive: true, force: true });

console.log(`press-zip → ${OUT}`);

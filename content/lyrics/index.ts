import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const lyricsDir = join(process.cwd(), "content/lyrics");

function parseLyricsFile(fileName: string): string[][] {
  const raw = readFileSync(join(lyricsDir, fileName), "utf8").trim();
  if (!raw) return [];

  return raw
    .split(/\n{2,}/)
    .map((stanza) =>
      stanza
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((stanza) => stanza.length > 0);
}

// 파일명 규칙: <slug>.<lang>.md. slug에 이미 -ja가 포함돼 언어를 구분하므로
// (예: sarang-ui-suljan = 한국어 원곡, sarang-ui-suljan-ja = 일본어 재해석),
// 언어 접미사는 slug에서 제거한다.
export const lyrics: Record<string, string[][]> = Object.fromEntries(
  readdirSync(lyricsDir)
    .filter((fileName) => /\.(ko|ja)\.md$/.test(fileName))
    .sort()
    .map((fileName) => [
      fileName.replace(/\.(ko|ja)\.md$/, ""),
      parseLyricsFile(fileName),
    ]),
);

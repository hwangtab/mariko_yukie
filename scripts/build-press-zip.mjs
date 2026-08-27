/**
 * 프레스킷 MP3 묶음을 빌드 시점에 만든다.
 *
 * ZIP을 저장소에 커밋하지 않는 이유가 둘이다. 하나는 GitHub가 100MB 넘는
 * 파일을 거부한다는 것이고, 다른 하나는 음원이 바뀔 때마다 바이너리가
 * 이력에 쌓인다는 것이다. public/audio의 곡을 빌드마다 묶으면 둘 다 없다.
 *
 * 압축은 하지 않는다(store). MP3는 이미 압축돼 있어 deflate를 걸어도
 * 1~2%밖에 줄지 않고, 그만큼 빌드 시간만 쓴다. 그래서 외부 의존성 없이
 * 최소 ZIP 라이터로 충분하다.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { crc32 } from "node:zlib";

const AUDIO_DIR = join(process.cwd(), "public/audio");
const OUT = join(process.cwd(), "public/press/namsan-tower-press-kit.zip");
const FOLDER = "Namsan Tower Lights - Mariko & Yukie";

/** 트랙 순서를 파일명이 아니라 앨범 순서로 맞춘다. */
const ORDER = [
  "mariyuki-theme", "sarang-ui-suljan", "hot-flash", "beer-and-coffee", "namsan-tower",
  "maja-maja-song", "sul-sodok-blues", "hongeo-tears", "annyeong-my-love", "gohyang",
  "sarang-ui-suljan-ja", "hot-flash-ja", "beer-and-coffee-ja", "namsan-tower-ja", "yume-no-hito",
];
const TITLES = [
  "Mari-Yuki Theme", "Cup of Love", "Hot Flash", "Beer and Coffee", "Namsan Tower Lights",
  "Maja Maja Song", "Alcohol Blues", "Tears of the Skate", "Goodbye My Love", "Hometown",
  "Cup of Love (JP)", "Hot Flash (JP)", "Beer and Coffee (JP)", "Namsan Tower Lights (JP)",
  "The Person I Saw in a Dream",
];

const README = `Namsan Tower Lights (남산타워)
Mariko & Yukie — 1st Album, released 4 September 2026

15 tracks: 10 in Korean, 5 in Japanese.
MP3 192 kbps listening copies. Mastered by Hashimoto Yoei at Aubrite Mastering Studio.

Press kit (streaming, lyrics, 4000px artwork, full credits):
https://marikoyukie.vercel.app/en/press

Full album on YouTube (49 min, chaptered):
https://youtu.be/vYH3fOjVvTM

Need broadcast-quality files? Reply to the email you received, or write to
hwangtab@gmail.com — we will send 320 kbps MP3 or WAV masters
(44.1 kHz/16 bit or 48 kHz/24 bit).

Mariko & Yukie
`;

/** ZIP local header + central directory. store(0) 방식만 쓴다. */
function zipStore(entries) {
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // UTF-8 파일명 플래그
    local.writeUInt16LE(0, 8); // store
    local.writeUInt16LE(0, 10); // time
    local.writeUInt16LE(0, 12); // date
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuf, data);

    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(0, 10);
    cen.writeUInt16LE(0, 12);
    cen.writeUInt16LE(0, 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(data.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt16LE(0, 30);
    cen.writeUInt16LE(0, 32);
    cen.writeUInt16LE(0, 34);
    cen.writeUInt16LE(0, 36);
    cen.writeUInt32LE(0, 38);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, nameBuf);

    offset += local.length + nameBuf.length + data.length;
  }

  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, centralBuf, end]);
}

const entries = [];
ORDER.forEach((slug, i) => {
  const path = join(AUDIO_DIR, `${slug}.mp3`);
  if (!statSync(path, { throwIfNoEntry: false })) {
    throw new Error(`press-zip: 음원이 없습니다 — ${path}`);
  }
  const n = String(i + 1).padStart(2, "0");
  entries.push({ name: `${FOLDER}/${n} ${TITLES[i]}.mp3`, data: readFileSync(path) });
});
entries.push({ name: `${FOLDER}/cover.jpg`, data: readFileSync(join(process.cwd(), "public/press/email-cover.jpg")) });
entries.push({ name: `${FOLDER}/README.txt`, data: Buffer.from(README, "utf8") });

mkdirSync(join(process.cwd(), "public/press"), { recursive: true });
const zip = zipStore(entries);
writeFileSync(OUT, zip);
console.log(`press-zip: ${entries.length}개 파일 · ${(zip.length / 1024 / 1024).toFixed(1)}MB → public/press/namsan-tower-press-kit.zip`);

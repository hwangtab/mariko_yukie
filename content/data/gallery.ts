import type { GalleryItem } from "./types";
import { tracks } from "./tracks";

// ── 이미지 레지스트리 (public/images, MV 「남산타워」 스틸 2026-04-21) ──
const img = (n: string) => `/images/${n}`;
export const images = {
  cover: img("album_cover.webp"),
  heroNight: img("namsan_69.webp"),
  towerNight: img("namsan_71.webp"),
  filmstrip: img("namsan_77.webp"),
  walk: img("namsan_33.webp"),
  deck: img("namsan_44.webp"),
  table: img("namsan_22.webp"),
  stage: img("namsan_19.webp"),
};

// ── 트랙 대표 이미지 (강한 매칭만) ──
export const trackImages: Record<string, string> = {
  "namsan-tower": images.towerNight,
  "sul-sodok-blues": images.table,
  "annyeong-my-love": "/images/namsan_13.webp",
  "hongeo-tears": "/images/namsan_16.webp",
  gohyang: "/images/namsan_59.webp",
  "beer-and-coffee": "/images/namsan_29.webp",
  "maja-maja-song": "/images/namsan_74.webp",
  "hot-flash": "/images/namsan_08.webp",
  "sarang-ui-suljan": "/images/namsan_22.webp",
};

// ── 트랙 음원 (public/audio, 192kbps 마스터) ── 슬러그 → mp3 경로
export const trackAudio: Record<string, string> = Object.fromEntries(
  tracks.map((t) => [t.slug, `/audio/${t.slug}.mp3`]),
);

// ── 갤러리 (MV 「남산타워」 촬영 스틸, 2026-04-21) ──
export const gallery: GalleryItem[] = [
  { file: "/images/namsan_69.webp", caption: { ko: "남산 야경 아래, 두 사람", ja: "南山の夜景の下、二人", en: "The two under Namsan's night view" } },
  { file: "/images/namsan_44.webp", caption: { ko: "전망대에서", ja: "展望台にて", en: "At the observatory" } },
  { file: "/images/namsan_19.webp", caption: { ko: "무대 위", ja: "ステージの上", en: "On stage" } },
  { file: "/images/namsan_07.webp", caption: { ko: "마리코, 열창", ja: "マリコ、熱唱", en: "Mariko, singing her heart out" } },
  { file: "/images/namsan_04.webp", caption: { ko: "유키에와 기타", ja: "ユキエとギター", en: "Yukie and his guitar" } },
  { file: "/images/namsan_33.webp", caption: { ko: "서울, 동네 산책", ja: "ソウル、近所の散歩", en: "Seoul, a neighborhood walk" } },
  { file: "/images/namsan_22.webp", caption: { ko: "맥주와 커피 사이", ja: "ビールとコーヒーのあいだ", en: "Between beer and coffee" } },
  { file: "/images/namsan_77.webp", caption: { ko: "네 컷, 그리고 타워", ja: "プリクラ、そしてタワー", en: "Photo strip, and the tower" } },
  { file: "/images/namsan_71.webp", caption: { ko: "남산타워, 초록빛 밤", ja: "南山タワー、緑の夜", en: "Namsan Tower, a green night" } },
  { file: "/images/namsan_13.webp", caption: { ko: "피날레", ja: "フィナーレ", en: "Finale" } },
  { file: "/images/namsan_72.webp", caption: { ko: "까르르", ja: "けらけら", en: "Giggles" } },
  { file: "/images/namsan_30.webp", caption: { ko: "건배", ja: "乾杯", en: "Cheers" } },
  { file: "/images/namsan_20.webp", caption: { ko: "웃음 사이", ja: "笑いのなかで", en: "Amid the laughter" } },
  { file: "/images/namsan_74.webp", caption: { ko: "브이!", ja: "ピース!", en: "Peace!" } },
];

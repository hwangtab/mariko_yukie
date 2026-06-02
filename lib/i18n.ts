// 다국어(i18n) — KO/JA/EN (docs/website/04-i18n-strategy.md)

export const locales = ["ko", "ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** 다국어 객체에서 현재 언어 값을 꺼낸다. 누락 시 한국어로 폴백. */
export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.ko;
}

/** 인라인 3개 언어 선택 헬퍼 */
export function tri(locale: Locale, ko: string, ja: string, en: string): string {
  return locale === "ja" ? ja : locale === "en" ? en : ko;
}

export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  ja: "日本語",
  en: "EN",
};

// ── UI 문자열 사전 ──
export const ui = {
  nav: {
    artists: { ko: "아티스트", ja: "アーティスト", en: "Artists" },
    album: { ko: "앨범", ja: "アルバム", en: "Album" },
    video: { ko: "뮤직비디오", ja: "MV", en: "Video" },
    gallery: { ko: "갤러리", ja: "ギャラリー", en: "Gallery" },
    lyrics: { ko: "가사", ja: "歌詞", en: "Lyrics" },
    live: { ko: "공연·소식", ja: "ライブ", en: "Live" },
    about: { ko: "소개", ja: "について", en: "About" },
  },
  cta: {
    support: { ko: "텀블벅에서 후원하기", ja: "텀블벅で応援する", en: "Back us on Tumblbug" },
    supportShort: { ko: "후원하기", ja: "応援する", en: "Support" },
    listen: { ko: "음원 듣기", ja: "音源を聴く", en: "Listen" },
    watchMV: { ko: "뮤직비디오 보기", ja: "ミュージックビデオを見る", en: "Watch the video" },
    soon: { ko: "곧 공개", ja: "近日公開", en: "Coming soon" },
  },
  common: {
    discography: { ko: "디스코그래피", ja: "ディスコグラフィー", en: "Discography" },
    history: { ko: "주요 이력", ja: "主な経歴", en: "Career" },
    tracklist: { ko: "수록곡", ja: "収録曲", en: "Tracklist" },
    spec: { ko: "음반 사양", ja: "アルバム仕様", en: "Specifications" },
    readMore: { ko: "자세히", ja: "詳しく", en: "Read more" },
    backToAlbum: { ko: "← 앨범으로", ja: "← アルバムへ", en: "← Back to album" },
    lyricsOf: { ko: "가사", ja: "歌詞", en: "Lyrics" },
    titleTrack: { ko: "타이틀곡", ja: "タイトル曲", en: "Title" },
    bonus: { ko: "보너스", ja: "ボーナス", en: "Bonus" },
    mv: { ko: "MV", ja: "MV", en: "MV" },
    contactMedia: { ko: "미디어 문의", ja: "メディアのお問い合わせ", en: "Press & media" },
    listenLinks: { ko: "들을 수 있는 곳", ja: "配信リンク", en: "Where to listen" },
  },
  home: {
    enter: { ko: "들어가기", ja: "入る", en: "Enter" },
    project: { ko: "발매 프로젝트 2026", ja: "リリースプロジェクト 2026", en: "Release Project 2026" },
  },
} as const;

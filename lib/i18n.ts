// 다국어(i18n) — KO/JA 동등 원칙 (docs/website/04-i18n-strategy.md)

export const locales = ["ko", "ja"] as const;
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

// ── UI 문자열 사전 ──
export const ui = {
  nav: {
    artists: { ko: "아티스트", ja: "アーティスト" },
    album: { ko: "앨범", ja: "アルバム" },
    video: { ko: "뮤직비디오", ja: "MV" },
    gallery: { ko: "갤러리", ja: "ギャラリー" },
    lyrics: { ko: "가사", ja: "歌詞" },
    live: { ko: "공연·소식", ja: "ライブ" },
    about: { ko: "소개", ja: "について" },
  },
  cta: {
    support: { ko: "텀블벅에서 후원하기", ja: "텀블벅で応援する" },
    supportShort: { ko: "후원하기", ja: "応援する" },
    listen: { ko: "음원 듣기", ja: "音源を聴く" },
    watchMV: { ko: "뮤직비디오 보기", ja: "ミュージックビデオを見る" },
    soon: { ko: "곧 공개", ja: "近日公開" },
  },
  common: {
    discography: { ko: "디스코그래피", ja: "ディスコグラフィー" },
    history: { ko: "주요 이력", ja: "主な経歴" },
    tracklist: { ko: "수록곡", ja: "収録曲" },
    spec: { ko: "음반 사양", ja: "アルバム仕様" },
    readMore: { ko: "자세히", ja: "詳しく" },
    backToAlbum: { ko: "← 앨범으로", ja: "← アルバムへ" },
    lyricsOf: { ko: "가사", ja: "歌詞" },
    titleTrack: { ko: "타이틀곡", ja: "タイトル曲" },
    bonus: { ko: "보너스", ja: "ボーナス" },
    mv: { ko: "MV", ja: "MV" },
    jaPending: {
      ko: "이 페이지의 일본어 번역을 준비하고 있습니다.",
      ja: "日本語版は準備中です。",
    },
    contactMedia: { ko: "미디어 문의", ja: "メディアのお問い合わせ" },
    listenLinks: { ko: "들을 수 있는 곳", ja: "配信リンク" },
  },
  home: {
    enter: { ko: "들어가기", ja: "入る" },
    project: { ko: "발매 프로젝트 2026", ja: "リリースプロジェクト 2026" },
  },
} as const;

// ── 외부 링크 ── 빈 값은 UI에서 자동 숨김
export const links = {
  tumblbug: "https://tumblbug.com/marikoandyukie", // 펀딩 페이지
  musicVideoYoutubeId: "bWIwjnij0XQ", // 영상 ID (https://youtu.be/bWIwjnij0XQ)
  fullAlbumYoutubeId: "vYH3fOjVvTM", // 전곡 이어듣기 49분, 화면·자막 한국어 (https://youtu.be/vYH3fOjVvTM)
  // 로케일별 판. 화면 텍스트와 자막이 각 언어로 된 별도 영상이다.
  // 값을 비우면 한국어판으로 폴백한다(비공개 영상을 임베드하면 재생 오류가 나므로,
  // 공개 전환 전까지는 비워 둘 것).
  fullAlbumYoutubeIdJa: "4PAOi9qAe-0", // 일본어판 (https://youtu.be/4PAOi9qAe-0)
  fullAlbumYoutubeIdEn: "S8UdPUHPHR0", // 영어판 (https://youtu.be/S8UdPUHPHR0)
  streaming: {
    spotify: "",
    appleMusic: "",
    youtubeMusic: "",
    melon: "",
  },
  sns: {
    youtubeChannel: "https://www.youtube.com/@marikoandyukie", // 공식 채널
    marikoInstagram: "https://instagram.com/mariko_1109",
    marikoTwitter: "https://twitter.com/torotto9",
    yukieYoutube: "https://www.youtube.com/channel/UC6PtS4px3uFY8HKZnM4SzWA", // 사토유키에 개인 J-Music Archive
    yukieFacebook: "https://www.facebook.com/Kopchangjeongol",
  },
  contactEmail: "hello@studionol.co.kr",
};

/** 로케일에 맞는 전곡 이어듣기 영상 ID. 일본어판이 준비되지 않았으면 한국어판을 쓴다. */
export function fullAlbumVideoId(locale: string): string {
  if (locale === "ja" && links.fullAlbumYoutubeIdJa) return links.fullAlbumYoutubeIdJa;
  if (locale === "en" && links.fullAlbumYoutubeIdEn) return links.fullAlbumYoutubeIdEn;
  return links.fullAlbumYoutubeId;
}

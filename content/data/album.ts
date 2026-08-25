import type { Localized } from "@/lib/i18n";
import type { SpecRow } from "./types";
import { productionCredits } from "./production";

// ── 앨범 ──
export const album = {
  title: { ko: "남산타워", ja: "南山タワー", en: "Namsan Tower Lights" } as Localized,
  titleRoman: "Namsan Tower Lights",
  artist: { ko: "마리코 & 유키에", ja: "マリコ & ユキエ", en: "Mariko & Yukie" } as Localized,
  artistRoman: "Mariko & Yukie",
  releaseLabel: {
    ko: "2026년 9월 4일 발매",
    ja: "2026年9月4日リリース",
    en: "Out September 4, 2026",
  } as Localized,
  concept: {
    ko: "60~70년대 음악을 몸으로 관통한 사람이 2026년에 내는 음반입니다. 오래됐지만 새롭고, 낯설지만 익숙한 소리.",
    ja: "1960〜70年代の音楽を肌で感じてきた人間が、2026年に出すアルバムです。古いのに新しく、初めてなのに懐かしいサウンド。",
    en: "An album made in 2026 by someone who lived and breathed '60s–'70s music. Old yet new, unfamiliar yet familiar.",
  } as Localized,
  says: {
    ko: [
      "이 음반은 한국과 일본 사이에서 살아가는 두 일본인의 서울 생활기다. 관광객의 시선이 아니라, 이미 서울이 집이 된 사람들의 시선. 남산타워는 그들에게 명소가 아니라 동네 랜드마크다.",
      "그래서 이 음반에는 유머가 있다. 억지로 웃기려는 것이 아니라, 함께 살다 보면 생기는 자연스러운 웃음들. 그러면서도 진지한 순간들이 있다. 요절한 친구에게 바치는 선율, 고향이 어디인지 모르는 감각, 오래된 커플이 부르는 사랑 노래.",
    ],
    ja: [
      "このアルバムは、韓国と日本のあいだで生きる二人の日本人のソウル暮らしの記録だ。観光客の視線ではなく、すでにソウルが家になった人たちの視線。南山タワーは彼らにとって名所ではなく、近所のランドマークだ。",
      "だからこのアルバムにはユーモアがある。無理に笑わせようとするのではなく、共に暮らすうちに生まれる自然な笑い。それでいて真剣な瞬間がある。早世した友に捧げる旋律、故郷がどこか分からない感覚、長く連れ添った夫婦が歌う愛の歌。",
    ],
    en: [
      "This album is a record of two Japanese musicians living between Korea and Japan — their everyday life in Seoul. Not a tourist's gaze, but the gaze of people for whom Seoul has already become home. To them, Namsan Tower isn't a sight to visit; it's the landmark in their neighborhood.",
      "So there is humor here — not forced jokes, but the natural laughter that grows from living together. And there are serious moments too: a melody dedicated to a friend who died young, the feeling of not knowing where home is, a love song an old couple sings.",
    ],
  } as Localized<string[]>,
  positioning: [
    {
      ko: "60~70년대 그룹 사운드를 몸으로 체화한 사람이 만든 음반",
      ja: "60〜70年代グループサウンドを体に刻んだ人が作ったアルバム",
      en: "An album by someone who absorbed '60s–'70s group sound into his very body",
    },
    {
      ko: "한국어와 일본어가 동등하게 존재하는 음반 — 번역이 아닌 재해석",
      ja: "韓国語と日本語が対等に存在するアルバム — 翻訳ではなく再解釈",
      en: "An album where Korean and Japanese exist as equals — reinterpretation, not translation",
    },
    {
      ko: "기획 회의가 아니라 두 사람의 생활에서 그대로 나온 곡들",
      ja: "企画会議ではなく、二人の暮らしからそのまま生まれた曲たち",
      en: "Songs that came straight from the two's daily life, not a planning meeting",
    },
    {
      ko: "한일 문화 교류의 역방향 — 일본인 둘이 서울에서 한국 음악을 흡수해 만든 소리",
      ja: "日韓文化交流の逆方向 — 日本人二人がソウルで韓国音楽を吸収して作った音",
      en: "Korea–Japan exchange in reverse — two Japanese in Seoul absorbing Korean music to make their own",
    },
  ] as Localized[],
  spec: [
    { label: { ko: "수록 트랙", ja: "収録トラック", en: "Tracks" }, value: { ko: "총 15트랙", ja: "全15トラック", en: "15 tracks" } },
    { label: { ko: "언어", ja: "言語", en: "Language" }, value: { ko: "한국어 10 + 일본어 5", ja: "韓国語10 + 日本語5", en: "10 Korean + 5 Japanese" } },
    { label: { ko: "포맷", ja: "フォーマット", en: "Format" }, value: { ko: "CD(주얼 케이스) + 디지털 음원", ja: "CD(ジュエルケース) + デジタル音源", en: "CD (jewel case) + digital" } },
    { label: { ko: "부클릿", ja: "ブックレット", en: "Booklet" }, value: { ko: "12p, 한·일 가사 + Thanks To", ja: "12p、韓・日歌詞 + Thanks To", en: "12p, KR·JP lyrics + Thanks To" } },
    { label: { ko: "제작 수량", ja: "製作数", en: "Pressing" }, value: { ko: "500장 한정", ja: "500枚限定", en: "500 copies, limited" } },
    { label: { ko: "발매", ja: "リリース", en: "Release" }, value: { ko: "2026년 9월 4일", ja: "2026年9月4日", en: "September 4, 2026" } },
    { label: { ko: "프로듀스", ja: "プロデュース", en: "Produced by" }, value: productionCredits.producer },
    { label: { ko: "레코딩 스튜디오", ja: "レコーディングスタジオ", en: "Recording Studio" }, value: productionCredits.recordingStudio },
    { label: { ko: "믹싱 스튜디오", ja: "ミキシングスタジオ", en: "Mixing Studio" }, value: productionCredits.mixingStudio },
    { label: { ko: "마스터링 스튜디오", ja: "マスタリングスタジオ", en: "Mastering Studio" }, value: productionCredits.masteringStudio },
    { label: { ko: "레코딩 디렉터", ja: "レコーディングディレクター", en: "Recording Director" }, value: productionCredits.recordingDirector },
    { label: { ko: "믹싱 엔지니어", ja: "ミキシングエンジニア", en: "Mixing Engineer" }, value: productionCredits.mixingEngineer },
    { label: { ko: "마스터링 엔지니어", ja: "マスタリングエンジニア", en: "Mastering Engineer" }, value: productionCredits.masteringEngineer },
    { label: { ko: "오리지널 아트워크 & 디자인", ja: "オリジナルアートワーク & デザイン", en: "Original Artwork & Design" }, value: productionCredits.originalArtworkDesign },
  ] as SpecRow[],
};

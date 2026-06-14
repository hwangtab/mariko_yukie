// 콘텐츠 데이터 (파일 기반 SSOT) — docs/website/02-content-spec.md
// 원천: docs/plan/album_plan.md, docs/plan/tumblbug/funding_plan.md
import type { Localized } from "./i18n";

export interface DiscoRow {
  year: string;
  title: Localized;
  note?: Localized;
}
export interface HistoryRow {
  year: string;
  text: Localized;
}
export interface Artist {
  id: "mariko" | "yukie";
  name: Localized;
  roman: string;
  tagline: Localized;
  lead: Localized;
  body: Localized<string[]>;
  quote?: Localized; // 인용 한마디
  photo: string; // 대표 사진 (public 경로)
  gallery: string[]; // 보조 사진
  links: { label: string; href: string }[];
  discography: DiscoRow[];
  history: HistoryRow[];
}
export interface Track {
  number: number;
  slug: string;
  title: Localized;
  type: Localized;
  language: "ko" | "ja";
  isTitle?: boolean;
  isBonus?: boolean;
  hasMV?: boolean;
  pull?: Localized; // 한 줄 캐치프레이즈
  body: Localized<string[]>;
  image?: string; // 트랙 대표 이미지
}
export interface GalleryItem {
  file: string;
  caption: Localized;
}
export interface StoryBlock {
  kicker: Localized;
  title: Localized;
  body: Localized;
}
export interface SpecRow {
  label: Localized;
  value: Localized;
}
export interface EventItem {
  id: string;
  type: "release" | "tour" | "news";
  title: Localized;
  dateLabel: Localized;
  venue: Localized;
  note: Localized;
  status: "tentative" | "confirmed" | "past";
}

// ── 외부 링크 (links.json 역할) ── 빈 값은 UI에서 자동 숨김
export const links = {
  tumblbug: "https://tumblbug.com/marikoandyukie", // 펀딩 페이지
  musicVideoYoutubeId: "bWIwjnij0XQ", // 영상 ID (https://youtu.be/bWIwjnij0XQ)
  streaming: {
    spotify: "",
    appleMusic: "",
    youtubeMusic: "",
    melon: "",
  },
  sns: {
    marikoInstagram: "https://instagram.com/mariko_1109",
    marikoTwitter: "https://twitter.com/torotto9",
    yukieYoutube: "https://www.youtube.com/channel/UC6PtS4px3uFY8HKZnM4SzWA",
    yukieFacebook: "https://www.facebook.com/Kopchangjeongol",
  },
  contactEmail: "contact@kosmart.org",
};

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

// ── 앨범 ──
export const album = {
  title: { ko: "남산타워", ja: "南山タワー", en: "Namsan Tower Lights" } as Localized,
  titleRoman: "Namsan Tower Lights",
  artist: { ko: "마리코 & 유키에", ja: "マリコ & ユキエ", en: "Mariko & Yukie" } as Localized,
  artistRoman: "Mariko & Yukie",
  releaseLabel: {
    ko: "2026년 8월 발매 예정",
    ja: "2026年8月リリース予定",
    en: "Out August 2026",
  } as Localized,
  concept: {
    ko: "60~70년대 음악을 몸으로 관통한 사람이 2026년에 내는 음반입니다. 오래됐지만 새롭고, 낯설지만 익숙한 소리.",
    ja: "60〜70年代の音楽を体で通り抜けた人が2026年に出すアルバムです。古いのに新しく、見知らぬのに懐かしい音。",
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
    { label: { ko: "발매", ja: "リリース", en: "Release" }, value: { ko: "2026년 8월", ja: "2026年8月", en: "August 2026" } },
    { label: { ko: "녹음·믹싱", ja: "録音・ミックス", en: "Recording / Mix" }, value: { ko: "스튜디오 놀", ja: "スタジオ・ノル", en: "Studio Nol" } },
    { label: { ko: "마스터링", ja: "マスタリング", en: "Mastering" }, value: { ko: "일본 (사토유키에 협업)", ja: "日本(佐藤行衛と協業)", en: "Japan (with Sato Yukie)" } },
  ] as SpecRow[],
};

// ── 트랙 (15) ──
export const tracks: Track[] = [
  {
    number: 1, slug: "mariyuki-theme", language: "ko",
    title: { ko: "마리 유키 테마", ja: "マリ・ユキ テーマ", en: "Mari-Yuki Theme" },
    type: { ko: "인트로 소곡", ja: "イントロ小曲", en: "Intro" },
    body: {
      ko: ["두 사람의 이름을 합친 앨범 오프닝 소곡. 짧은 곡이지만 이 음반 전체의 온도를 먼저 보여준다. 뒤에 이어질 14곡이 어떤 세계인지 미리 알려주는 문 같은 트랙."],
      ja: ["二人の名前を合わせたアルバムのオープニング小曲。短い曲だが、このアルバム全体の温度を先に見せる。続く14曲がどんな世界かを告げる、扉のようなトラック。"],
      en: ["A short opening piece blending the two names. Brief, but it sets the temperature of the whole record — a door into the world of the fourteen songs that follow."],
    },
  },
  {
    number: 2, slug: "sarang-ui-suljan", language: "ko",
    title: { ko: "사랑의 술잔", ja: "愛の盃", en: "Cup of Love" },
    type: { ko: "듀엣, 그룹 사운드", ja: "デュエット、グループサウンド", en: "Duet, group sound" },
    pull: { ko: "사토유키에의 작법이 가장 따뜻하게 빛나는 트랙", ja: "サトウユキエの作法が最も温かく輝くトラック", en: "Where Sato Yukie's songwriting glows warmest" },
    body: {
      ko: [
        "은혼식·금혼식을 맞이하는 오래된 부부의 사랑 노래. 사토유키에 특유의 따뜻한 코드 진행과 그 위를 흐르는 멜로디가 노래 전체를 감싼다.",
        "이 음반에서 언어적으로 가장 정교한 트랙. \"여보여보\" — 한국어로는 배우자를 부르는 호칭이지만, 일본어로는 노인의 늙은 모습을 나타내는 의태어다. 두 언어에서 동시에 작동하는 이 가사는 이 두 사람만이 쓸 수 있는 것이다.",
      ],
      ja: [
        "銀婚式・金婚式を迎える長年の夫婦の愛の歌。サトウユキエ特有の温かいコード進行と、その上を流れるメロディが曲全体を包む。",
        "このアルバムで言語的に最も精巧なトラック。「ヨボヨボ」— 韓国語では配偶者を呼ぶ呼称だが、日本語では老人の老いた様子を表す擬態語だ。二つの言語で同時に働くこの歌詞は、この二人にしか書けない。",
      ],
      en: [
        "A love song for an old couple reaching their silver and golden wedding anniversaries. Sato Yukie's warm chord progressions and the melody flowing over them wrap the whole song.",
        "The most linguistically intricate track on the album. \"Yeobo-yeobo\" — in Korean it's how you address your spouse, but in Japanese it's an onomatopoeia for an old person's frailty. A lyric that works in both languages at once — something only these two could write.",
      ],
    },
  },
  {
    number: 3, slug: "hot-flash", language: "ko",
    title: { ko: "핫 플래시", ja: "ホットフラッシュ", en: "Hot Flash" },
    type: { ko: "그룹 사운드 + 트로트", ja: "グループサウンド + トロット", en: "Group sound + trot" },
    pull: { ko: "사토유키에의 에너지와 마리코의 트로트 감성이 가장 선명하게 만나는 트랙", ja: "サトウユキエのエネルギーとマリコのトロット感性が最も鮮明に出会うトラック", en: "Where Sato Yukie's energy and Mariko's trot meet most vividly" },
    body: {
      ko: ["여성의 갱년기를 정면으로 노래한 러브송. 아무도 쓰지 않으려 했던 소재를 유머와 진심으로 정면 돌파한다. 그룹 사운드 특유의 두툼한 밴드 에너지가 치고 나오는 자리에서 마리코의 트로트 보컬이 그것을 자연스럽게 받아 넘긴다."],
      ja: ["女性の更年期を正面から歌ったラブソング。誰も書こうとしなかった題材を、ユーモアと真心で正面突破する。グループサウンド特有の厚いバンドエネルギーが鳴り響くところで、マリコのトロットボーカルがそれを自然に受け流す。"],
      en: ["A love song that confronts menopause head-on — a subject no one wanted to touch, met with humor and sincerity. Where the thick band energy of group sound surges, Mariko's trot vocals catch it and carry it on, effortlessly."],
    },
  },
  {
    number: 4, slug: "beer-and-coffee", language: "ko",
    title: { ko: "맥주와 커피", ja: "ビールとコーヒー", en: "Beer and Coffee" },
    type: { ko: "듀엣, 서정적", ja: "デュエット、叙情的", en: "Duet, lyrical" },
    pull: { ko: "60~70년대 그룹 사운드의 서정적인 면이 드러나는 트랙", ja: "60〜70年代グループサウンドの叙情的な面が表れるトラック", en: "Where the lyrical side of '60s–'70s group sound shows" },
    body: {
      ko: ["사토유키에는 맥주파, 마리코는 커피파. 일상의 사소한 취향 차이가 그대로 곡이 됐다. 아날로그 특유의 따뜻한 음색 위에 두 사람의 목소리가 얹힌다."],
      ja: ["サトウユキエはビール派、マリコはコーヒー派。日常のささいな好みの違いが、そのまま曲になった。アナログ特有の温かい音色の上に、二人の声が重なる。"],
      en: ["Sato Yukie is a beer person, Mariko a coffee person. A tiny everyday difference in taste became a song. Two voices rest over a warm analog tone."],
    },
  },
  {
    number: 5, slug: "namsan-tower", language: "ko", isTitle: true, hasMV: true,
    title: { ko: "남산타워 Namsan Tower Lights", ja: "南山タワー Namsan Tower Lights", en: "Namsan Tower Lights" },
    type: { ko: "그룹 사운드 · 타이틀곡 · 뮤직비디오", ja: "グループサウンド・タイトル曲・MV", en: "Group sound · title track · music video" },
    pull: { ko: "이 음반의 타이틀곡이자 뮤직비디오 수록곡", ja: "このアルバムのタイトル曲でありMV収録曲", en: "The album's title track and music-video song" },
    body: {
      ko: [
        "1960년대 기타 인스트루멘탈·서프 사운드와 그 시대 한국 가요의 감각이 만나는 지점에서 만든 서울 남산타워 응원가. 기타 리프, 코드 진행, 리듬의 처리 방식 — 모두 그 시대의 문법이다.",
        "서울시 비공인 남산타워 응원가. 진지하게 쓴 곡이다.",
      ],
      ja: [
        "1960年代のギター・インストゥルメンタル/サーフサウンドと、その時代の韓国歌謡の感覚が出会う地点で作ったソウル南山タワー応援歌。ギターリフ、コード進行、リズムの処理 — すべてその時代の文法だ。",
        "ソウル市非公認・南山タワー応援歌。本気で書いた曲だ。",
      ],
      en: [
        "A Seoul Namsan Tower anthem born where 1960s guitar instrumental/surf sound meets the feel of that era's Korean pop. The riffs, the chord progressions, the way the rhythm is handled — all the grammar of that time.",
        "Seoul's unofficial Namsan Tower anthem. Written in earnest.",
      ],
    },
  },
  {
    number: 6, slug: "maja-maja-song", language: "ko",
    title: { ko: "맞아 맞아 송", ja: "マジャマジャ・ソング", en: "Maja Maja (That's Right) Song" },
    type: { ko: "경쾌한 그룹 사운드", ja: "軽快なグループサウンド", en: "Upbeat group sound" },
    pull: { ko: "한국어를 몸으로 배운 사람만이 포착할 수 있는 감각", ja: "韓国語を体で学んだ人だけが捉えられる感覚", en: "A sense only someone who learned Korean with their body could catch" },
    body: {
      ko: ["한국 친구들과 이야기하다 보면 자연스럽게 나오는 \"맞아, 맞아.\" 외부인의 시선이 곡 안에서 유머로 작동한다. 그룹 사운드의 흥겨운 에너지가 이 트랙에서 가장 경쾌하게 터진다."],
      ja: ["韓国の友人と話していると自然に出てくる「マジャ、マジャ(そうそう)」。外部者の視線が曲の中でユーモアとして働く。グループサウンドの陽気なエネルギーが、このトラックで最も軽快に弾ける。"],
      en: ["\"Maja, maja (that's right, that's right)\" — what slips out naturally when chatting with Korean friends. An outsider's ear turns it into humor inside the song. The cheerful energy of group sound bursts brightest here."],
    },
  },
  {
    number: 7, slug: "sul-sodok-blues", language: "ko",
    title: { ko: "술 소독 Blues", ja: "酒消毒ブルース", en: "Alcohol Disinfection Blues" },
    type: { ko: "듀엣, 블루스, 헌정곡", ja: "デュエット、ブルース、献呈曲", en: "Duet, blues, tribute" },
    pull: { ko: "이 음반에서 가장 깊은 곳을 건드리는 트랙", ja: "このアルバムで最も深いところに触れるトラック", en: "The track that touches the album's deepest place" },
    body: {
      ko: ["사토유키에 솔로 앨범 《사랑스러운 그대》(2009) 수록곡을 마리코와 함께 다시 불렀다. 3번째 마디 뒤에 흐르는 선율에는 요절한 친구 가수 홍성민에 대한 헌정이 담겨있다. 슬픔을 직접 말하지 않고 선율 안에 숨겨두는 방식 — 블루스라는 형식이 가진 가장 오래된 지혜다."],
      ja: ["サトウユキエのソロアルバム《愛しき君へ》(2009)収録曲を、マリコと共に歌い直した。3小節目のあとに流れる旋律には、早世した友人歌手ホン・ソンミンへの献呈が込められている。悲しみを直接語らず旋律の中に隠す — ブルースという形式が持つ最も古い知恵だ。"],
      en: ["A song from Sato Yukie's solo album 'My Lovely You' (2009), re-sung here with Mariko. The melody that flows after the third bar carries a tribute to his late friend, the singer Hong Seong-min. Hiding grief inside melody rather than naming it — the oldest wisdom the blues holds."],
    },
  },
  {
    number: 8, slug: "hongeo-tears", language: "ko",
    title: { ko: "홍어의 눈물", ja: "ホンオの涙", en: "Tears of Hongeo" },
    type: { ko: "마리코 솔로, 트로트", ja: "マリコ・ソロ、トロット", en: "Mariko solo, trot" },
    pull: { ko: "마리코의 트로트 보컬이 전면에 나서는 트랙", ja: "マリコのトロットボーカルが前面に立つトラック", en: "Where Mariko's trot vocals take the front" },
    body: {
      ko: ["곱창전골 4집 《메뉴판》(2014) 수록곡. 마리코가 이 멜로디를 특히 사랑해 솔로로 부르게 됐다. 80년대 트로트 특유의 꺾임과 감정 처리가 가장 순수하게 드러나는 트랙."],
      ja: ["コプチャンチョンゴル4集《メニュー表》(2014)収録曲。マリコがこのメロディを特に愛し、ソロで歌うことになった。80年代トロット特有の節回しと感情処理が、最も純粋に表れるトラック。"],
      en: ["A song from Kopchangjeongol's 4th album 'Menu Board' (2014). Mariko loved this melody so much she sings it solo. The bends and emotional handling unique to '80s trot show at their purest here."],
    },
  },
  {
    number: 9, slug: "annyeong-my-love", language: "ko",
    title: { ko: "안녕 내사랑", ja: "アンニョン 私の愛", en: "Goodbye My Love" },
    type: { ko: "듀엣, 버블검 팝", ja: "デュエット、バブルガムポップ", en: "Duet, bubblegum pop" },
    pull: { ko: "공연장에서 완성되는 트랙", ja: "ライブ会場で完成するトラック", en: "A track completed in the live room" },
    body: {
      ko: ["공연 마지막에 관객과 함께 부를 수 있는 곡으로 만들었다. 1970년대 버블검 팝 사운드. 가볍고 밝지만 그 안에 따뜻함이 있다."],
      ja: ["ライブの最後に観客と一緒に歌える曲として作った。1970年代バブルガムポップサウンド。軽やかで明るいが、その中に温かさがある。"],
      en: ["Made as a song to sing together with the audience at the end of a show. 1970s bubblegum pop — light and bright, but with warmth inside."],
    },
  },
  {
    number: 10, slug: "gohyang", language: "ko",
    title: { ko: "고향", ja: "故郷", en: "Hometown" },
    type: { ko: "사토유키에 솔로", ja: "サトウユキエ・ソロ", en: "Sato Yukie solo" },
    pull: { ko: "이 음반의 정서적 정점, 사토유키에만이 쓸 수 있는 곡", ja: "このアルバムの情緒的頂点、サトウユキエにしか書けない曲", en: "The album's emotional peak — a song only Sato Yukie could write" },
    body: {
      ko: ["인생의 절반을 한국에서 살았지만 \"나의 고향은 어디인가\"라는 물음에 쉽게 답하지 못하는 감각. 어느 쪽에도 완전히 속하지 못하는 그 자리에서 쓴 노래. 이 곡이 있기 때문에 이 음반은 단순한 향수가 아닌 무언가가 된다."],
      ja: ["人生の半分を韓国で生きたが、「私の故郷はどこか」という問いに簡単には答えられない感覚。どちらにも完全には属せないその場所で書いた歌。この曲があるから、このアルバムは単なる郷愁ではない何かになる。"],
      en: ["Having lived half his life in Korea, yet unable to easily answer \"where is my hometown.\" A song written from that place of belonging fully to neither side. Because of it, the album becomes something more than mere nostalgia."],
    },
  },
  {
    number: 11, slug: "sarang-ui-suljan-ja", language: "ja",
    title: { ko: "사랑의 술잔 (일본어)", ja: "愛の盃(日本語)", en: "Cup of Love (Japanese)" },
    type: { ko: "02번 트랙 일본어 버전", ja: "2曲目の日本語バージョン", en: "Japanese version of track 2" },
    body: { ko: ["번역이 아닌 재해석. 일본어로 가장 자연스럽게 전달되도록 다시 썼다."], ja: ["翻訳ではなく再解釈。日本語で最も自然に伝わるよう書き直した。"], en: ["Reinterpretation, not translation — rewritten to land most naturally in Japanese."] },
  },
  {
    number: 12, slug: "hot-flash-ja", language: "ja",
    title: { ko: "핫 플래시 (일본어)", ja: "ホットフラッシュ(日本語)", en: "Hot Flash (Japanese)" },
    type: { ko: "03번 트랙 일본어 버전", ja: "3曲目の日本語バージョン", en: "Japanese version of track 3" },
    body: { ko: ["번역이 아닌 재해석."], ja: ["翻訳ではなく再解釈。"], en: ["Reinterpretation, not translation."] },
  },
  {
    number: 13, slug: "beer-and-coffee-ja", language: "ja",
    title: { ko: "맥주와 커피 (일본어)", ja: "ビールとコーヒー(日本語)", en: "Beer and Coffee (Japanese)" },
    type: { ko: "04번 트랙 일본어 버전", ja: "4曲目の日本語バージョン", en: "Japanese version of track 4" },
    body: { ko: ["번역이 아닌 재해석."], ja: ["翻訳ではなく再解釈。"], en: ["Reinterpretation, not translation."] },
  },
  {
    number: 14, slug: "namsan-tower-ja", language: "ja",
    title: { ko: "남산타워 (일본어)", ja: "南山タワー(日本語)", en: "Namsan Tower (Japanese)" },
    type: { ko: "05번 트랙 일본어 버전", ja: "5曲目の日本語バージョン", en: "Japanese version of track 5" },
    body: { ko: ["같은 멜로디가 두 언어에서 얼마나 다르게 울리는지 — 그 차이 자체가 들을 만한 것이다."], ja: ["同じメロディが二つの言語でどれほど違って響くか — その差そのものが聴きどころだ。"], en: ["How differently the same melody resonates in two languages — that difference itself is worth hearing."] },
  },
  {
    number: 15, slug: "yume-no-hito", language: "ja", isBonus: true,
    title: { ko: "꿈 속에서 본 사람 (일본어)", ja: "夢で見た人(日本語)", en: "The Person I Saw in a Dream (Japanese)" },
    type: { ko: "보너스 트랙", ja: "ボーナストラック", en: "Bonus track" },
    pull: { ko: "후원자가 먼저 만날 수 있는 곡", ja: "支援者が先に出会える曲", en: "A song backers hear first" },
    body: {
      ko: ["곱창전골 미발매 5집 《복숭아 스토리》에 수록될 예정인 곡의 일본어 버전. 한국어 버전은 5집 발매까지 조금 더 기다려 주세요."],
      ja: ["コプチャンチョンゴル未発表5集《桃ストーリー》に収録予定の曲の日本語バージョン。韓国語版は5集のリリースまで、もう少しお待ちください。"],
      en: ["The Japanese version of a song slated for Kopchangjeongol's unreleased 5th album 'Peach Story.' The Korean version will have to wait until that 5th album."],
    },
  },
];

export function getTrack(slug: string) {
  return tracks.find((tk) => tk.slug === slug);
}

// ── 아티스트 ──
export const artists: Artist[] = [
  {
    id: "mariko",
    name: { ko: "마리코", ja: "マリコ", en: "Mariko" },
    roman: "Trot MARIKO",
    tagline: { ko: "트로트를 사랑한 순례자", ja: "トロットを愛した巡礼者", en: "A pilgrim who loved trot" },
    lead: {
      ko: "마리코의 출발점은 팬이었다. 계산이 없었다. 트로트가 좋았고, 한국 무대에 서고 싶었고, 그 길을 스스로 만들어낸 사람이다.",
      ja: "マリコの出発点はファンだった。打算がなかった。トロットが好きで、韓国の舞台に立ちたくて、その道を自ら切り拓いた人だ。",
      en: "Mariko started out as a fan. No calculation. She loved trot, she wanted to stand on Korean stages, and she carved out that path herself.",
    },
    quote: {
      ko: "일본인이기 때문에 오히려 트로트의 본질에 더 가까이 — 역설적인 순수함.",
      ja: "日本人だからこそ、かえってトロットの本質に近く — 逆説的な純粋さ。",
      en: "Being Japanese brings her closer to the essence of trot — a paradoxical purity.",
    },
    photo: "/images/namsan_07.webp",
    gallery: ["/images/namsan_21.webp", "/images/namsan_16.webp", "/images/namsan_40.webp", "/images/namsan_18.webp"],
    body: {
      ko: [
        "2009년부터 일본에서 열리는 한국가요 콩쿠르에 나가기 시작했다. 2011년에는 전국대회에 참가했다. 수년간 일본에서 한국어 노래를 부르며 실력을 쌓은 뒤 직접 한국으로 건너왔다.",
        "2015년 KBS 전국노래자랑에 출연해 재능을 인정받았고, 2016년 1집 《사랑이랍니다》로 한국 CD 데뷔를 했다. 이후 한국에서 TV·라디오·이벤트·군 위문 공연을, 일본에서는 한국대사관·한일친선협회 공연과 트로트 강사로도 활동했다.",
        "그녀의 목소리에는 80년대 트로트 특유의 것이 있다. 꾸밈음이 자연스럽게 흐르고, 감정이 절제와 넘침 사이를 정확히 오간다. 일본인이기 때문에 오히려 트로트의 본질에 더 가까이 다가간 — 역설적인 순수함이 이 가수의 핵심이다.",
      ],
      ja: [
        "2009年から日本で開かれる韓国歌謡コンクールに出場し始めた。2011年には全国大会に参加。数年間、日本で韓国語の歌を歌って実力を積んだのち、自ら韓国へ渡った。",
        "2015年、KBS『全国のど自慢』に出演して才能を認められ、2016年に1集《サランイランニダ》で韓国CDデビュー。以後、韓国でTV・ラジオ・イベント・慰問公演を、日本では韓国大使館・日韓親善協会の公演やトロット講師としても活動した。",
        "彼女の声には80年代トロット特有のものがある。装飾音が自然に流れ、感情が抑制とあふれのあいだを正確に行き来する。日本人だからこそ、かえってトロットの本質に近づいた — 逆説的な純粋さがこの歌手の核心だ。",
      ],
      en: [
        "From 2009 she began entering Korean-song contests held in Japan, reaching the national competition in 2011. After years of singing in Korean in Japan, she crossed over to Korea herself.",
        "In 2015 she appeared on KBS's 'National Singing Contest' and won recognition; in 2016 she made her Korean CD debut with her first album 'Sarangirannida.' Since then she has performed on Korean TV, radio, events and military shows, and in Japan at the Korean Embassy and Korea–Japan friendship events, also teaching trot.",
        "Her voice carries something unmistakably '80s trot. The ornaments flow naturally; the feeling moves precisely between restraint and overflow. Being Japanese, she paradoxically reaches closer to the essence of trot — that paradoxical purity is the heart of this singer.",
      ],
    },
    links: [
      { label: "Instagram @mariko_1109", href: links.sns.marikoInstagram },
      { label: "Twitter @torotto9", href: links.sns.marikoTwitter },
    ],
    discography: [
      { year: "2016", title: { ko: "사랑이랍니다", ja: "サランイランニダ", en: "Sarangirannida" }, note: { ko: "한국 데뷔 CD", ja: "韓国デビューCD", en: "Korean debut CD" } },
      { year: "2021", title: { ko: "트로트 인생", ja: "トロット人生", en: "Trot Life" }, note: { ko: "일본 발매 · 프로듀스 사토유키에", ja: "日本リリース・プロデュース サトウユキエ", en: "Japan release · produced by Sato Yukie" } },
      { year: "2025", title: { ko: "행복이 따로 있나", ja: "幸せは別にあるのか", en: "Is Happiness Elsewhere" }, note: { ko: "2집", ja: "2集", en: "2nd album" } },
    ],
    history: [
      { year: "2009", text: { ko: "한국가요 콩쿠르 참가 시작", ja: "韓国歌謡コンクール参加開始", en: "Began entering Korean-song contests in Japan" } },
      { year: "2011", text: { ko: "전국대회 참가", ja: "全国大会参加", en: "Reached the national competition" } },
      { year: "2015", text: { ko: "KBS 전국노래자랑 출연", ja: "KBS『全国のど自慢』出演", en: "Appeared on KBS 'National Singing Contest'" } },
      { year: "2016", text: { ko: "1집 《사랑이랍니다》 — 한국 CD 데뷔", ja: "1集《サランイランニダ》— 韓国CDデビュー", en: "1st album 'Sarangirannida' — Korean CD debut" } },
      { year: "2025", text: { ko: "2집 《행복이 따로 있나》 발표", ja: "2集《幸せは別にあるのか》発表", en: "Released 2nd album 'Is Happiness Elsewhere'" } },
    ],
  },
  {
    id: "yukie",
    name: { ko: "사토유키에", ja: "佐藤行衛", en: "Sato Yukie" },
    roman: "Sato Yukie",
    tagline: { ko: "한국 록의 고고학자", ja: "韓国ロックの考古学者", en: "An archaeologist of Korean rock" },
    lead: {
      ko: "1995년, 32세의 그는 가장 싸게 갈 수 있는 해외가 한국이라는 이유로 서울에 왔다. 우연히 들른 음반 가게에서 신중현과 엽전들의 LP를 샀고 — 모든 것이 바뀌었다.",
      ja: "1995年、32歳の彼は「最も安く行ける海外」が韓国だという理由でソウルに来た。偶然立ち寄ったレコード店でシン・ジュンヒョンとヨプチョンドゥルのLPを買い — すべてが変わった。",
      en: "In 1995, at 32, he came to Seoul simply because Korea was the cheapest place abroad he could reach. At a record shop he wandered into, he bought an LP by Shin Joong-hyun and the Yup Juns — and everything changed.",
    },
    quote: {
      ko: "우리에게는 신중현과 산울림이 비틀스다.",
      ja: "僕たちにとっては、シン・ジュンヒョンとサヌリムがビートルズだ。",
      en: "For us, Shin Joong-hyun and Sanullim are the Beatles.",
    },
    photo: "/images/namsan_04.webp",
    gallery: ["/images/namsan_09.webp", "/images/namsan_05.webp", "/images/namsan_59.webp", "/images/namsan_30.webp"],
    body: {
      ko: [
        "그는 한국 록을 연구하기 위해 일본인만으로 밴드를 꾸렸다. 이름은 \"곱창전골\" — 아직 먹어보지도 못했지만 맛있을 것 같다는 이유로. 1999년, 한국 최초의 일본인 록 그룹으로 데뷔했다.",
        "당시 음반 이름에 일본인 이름이 들어가면 안 된다는 규정, 작사·작곡자에 일본인이 포함되면 안 된다는 규정에 부딪혔다. 2005년에는 관광비자 상태로 공연 입장료를 받았다는 이유로 강제 출국당했다. 김창완 등이 탄원서를 제출했지만 받아들여지지 않았다. 2006년 귀환, 2013년에야 예술인 비자를 취득했다.",
        "그는 지금도 서울에 산다. 30년째. 홍대 인디신의 역사이자 산증인이며, 오토모 요시히데·다모 스즈키 등 세계 정상급 프리재즈 뮤지션들과 교류하며 한일 음악 교류의 최전선을 지켰다. 2021년에는 《일본 LP 명반 가이드북》을 한국에서 출판했다.",
      ],
      ja: [
        "彼は韓国ロックを研究するため、日本人だけでバンドを組んだ。名前は「コプチャンチョンゴル」— まだ食べたこともないが美味しそうだという理由で。1999年、韓国初の日本人ロックグループとしてデビューした。",
        "当時、アルバム名に日本人の名前が入ってはならない規定、作詞・作曲者に日本人が含まれてはならない規定にぶつかった。2005年には観光ビザの状態で公演入場料を受け取ったとして強制出国させられた。キム・チャンワンらが嘆願書を提出したが受け入れられなかった。2006年に帰還、2013年にようやく芸術家ビザを取得した。",
        "彼は今もソウルに住む。30年目。ホンデ・インディーシーンの歴史であり生き証人であり、大友良英・ダモ鈴木ら世界トップクラスのフリージャズ・ミュージシャンと交流し、日韓音楽交流の最前線を守った。2021年には《日本LP名盤ガイドブック》を韓国で出版した。",
      ],
      en: [
        "To study Korean rock, he formed a band of all-Japanese members. The name: \"Kopchangjeongol\" — a Korean dish he hadn't even tasted yet but figured had to be delicious. In 1999 they debuted as Korea's first all-Japanese rock group.",
        "Back then he ran into rules: no Japanese name allowed in an album title, no Japanese among the credited songwriters. In 2005 he was deported for charging admission on a tourist visa. Kim Chang-wan and others filed petitions, to no avail. He returned in 2006 and only obtained an artist visa in 2013.",
        "He still lives in Seoul — 30 years now. A living witness to the history of Hongdae's indie scene, he has worked with world-class free-jazz musicians such as Otomo Yoshihide and Damo Suzuki, holding the front line of Korea–Japan musical exchange. In 2021 he published 'A Guidebook to Japanese LP Masterpieces' in Korea.",
      ],
    },
    links: [
      { label: "YouTube — J-Music Archive", href: links.sns.yukieYoutube },
      { label: "Facebook — Kopchangjeongol", href: links.sns.yukieFacebook },
    ],
    discography: [
      { year: "1999", title: { ko: "곱창전골 1집 《안녕하시므니까?》", ja: "コプチャンチョンゴル1集《アンニョンハシムニカ?》", en: "Kopchangjeongol 1st 'Annyeonghasimnikka?'" }, note: { ko: "Doremi Records", ja: "Doremi Records", en: "Doremi Records" } },
      { year: "2009", title: { ko: "솔로 《사랑스러운 그대》", ja: "ソロ《愛しき君へ》", en: "Solo 'My Lovely You'" }, note: { ko: "일본인이 전곡 한국어로 작사·작곡한 최초 음반", ja: "日本人が全曲韓国語で作詞・作曲した最初のアルバム", en: "First album fully written in Korean by a Japanese artist" } },
      { year: "2011–2014", title: { ko: "곱창전골 2·3·4집", ja: "コプチャンチョンゴル2・3・4集", en: "Kopchangjeongol 2·3·4" }, note: { ko: "Beatball Records", ja: "Beatball Records", en: "Beatball Records" } },
      { year: "2021", title: { ko: "일본 LP 명반 가이드북", ja: "日本LP名盤ガイドブック", en: "Japanese LP Masterpiece Guidebook" }, note: { ko: "한국 출판 (안나푸르나)", ja: "韓国出版(アンナプルナ)", en: "Published in Korea (Annapurna)" } },
    ],
    history: [
      { year: "1995", text: { ko: "곱창전골 결성", ja: "コプチャンチョンゴル結成", en: "Formed Kopchangjeongol" } },
      { year: "1999", text: { ko: "1집 — 한국 최초 일본인 록 그룹 데뷔", ja: "1集 — 韓国初の日本人ロックグループとしてデビュー", en: "1st album — debut as Korea's first all-Japanese rock group" } },
      { year: "2003", text: { ko: "홍대 실험음악 시리즈 '불가사리' 개최", ja: "ホンデ実験音楽シリーズ「プルガサリ」開催", en: "Launched Hongdae experimental-music series 'Bulgasari'" } },
      { year: "2010", text: { ko: "홍대앞 문화예술공로상 수상", ja: "ホンデ前・文化芸術功労賞受賞", en: "Received the Hongdae Culture & Arts Merit Award" } },
      { year: "2013", text: { ko: "한국 예술인 비자(D-1) 취득", ja: "韓国・芸術家ビザ(D-1)取得", en: "Obtained Korean artist visa (D-1)" } },
      { year: "2021", text: { ko: "《일본 LP 명반 가이드북》 한국 출판", ja: "《日本LP名盤ガイドブック》韓国出版", en: "Published 'Japanese LP Masterpiece Guidebook' in Korea" } },
    ],
  },
];

export function getArtist(id: string) {
  return artists.find((a) => a.id === id);
}

export const duoIntro = {
  ko: "두 사람은 2018년부터 함께 활동해왔다. 사토유키에의 60~70년대 빈티지 그룹 사운드와 마리코의 80년대 트로트 색채가 특정 트랙들에서 자연스럽게 맞물린다. 60~70년대 그룹 사운드와 80년대 트로트 사이에는 사실 그렇게 먼 거리가 없다 — 같은 시대의 공기를 마시고 자란 소리들이다.",
  ja: "二人は2018年から共に活動してきた。サトウユキエの60〜70年代ヴィンテージ・グループサウンドと、マリコの80年代トロットの色彩が特定のトラックで自然に噛み合う。60〜70年代グループサウンドと80年代トロットのあいだには、実はそれほど遠い距離はない — 同じ時代の空気を吸って育った音たちだ。",
  en: "The two have worked together since 2018. Sato Yukie's vintage '60s–'70s group sound and Mariko's '80s trot color lock together naturally on certain tracks. Between '60s–'70s group sound and '80s trot there really isn't much distance — these are sounds that grew up breathing the same era's air.",
} as Localized;

// ── 공연·소식 (events.json) ──
export const events: EventItem[] = [
  {
    id: "release-show-2026",
    type: "release",
    title: { ko: "《남산타워》 발매 기념공연", ja: "《南山タワー》リリース記念公演", en: "'Namsan Tower Lights' Release Show" },
    dateLabel: { ko: "2026년 9월 6일 (일) 오후 5시", ja: "2026年9月6日(日)17:00", en: "Sun, Sep 6, 2026 · 5 PM" },
    venue: { ko: "스페이스 한강 (서울)", ja: "スペース・ハンガン(ソウル)", en: "Space Hangang, Seoul" },
    note: { ko: "후원자 초청제로 진행되는 무료 공연입니다.", ja: "支援者招待制の無料公演です。", en: "A free, backers-invited show." },
    status: "confirmed",
  },
  {
    id: "tour-2026",
    type: "tour",
    title: { ko: "국내 지방 투어 (검토 중)", ja: "国内地方ツアー(検討中)", en: "Domestic regional tour (under review)" },
    dateLabel: { ko: "2026년 9~10월", ja: "2026年9〜10月", en: "Sept–Oct 2026" },
    venue: { ko: "대구 등 약 5개 도시", ja: "大邱など約5都市", en: "~5 cities incl. Daegu" },
    note: { ko: "펀딩 성과와 마리코 동행 가능 여부에 따라 확정됩니다.", ja: "ファンディングの成果とマリコの同行可否により確定します。", en: "To be confirmed depending on funding results and Mariko's availability." },
    status: "tentative",
  },
];

// ── 크레딧 (credits.json) — 공개 협의 중 항목은 일반 표기 ──
export const credits: { role: Localized; name: Localized }[] = [
  { role: { ko: "아티스트 / 작사·작곡·연주", ja: "アーティスト / 作詞・作曲・演奏", en: "Artists / writing · composing · performance" }, name: { ko: "마리코, 사토유키에", ja: "マリコ、佐藤行衛", en: "Mariko, Sato Yukie" } },
  { role: { ko: "기획·제작·운영", ja: "企画・制作・運営", en: "Planning · production · operation" }, name: { ko: "황경하 (스튜디오 놀)", ja: "ファン・ギョンハ(スタジオ・ノル)", en: "Hwang Kyeong-ha (Studio Nol)" } },
  { role: { ko: "비주얼 디렉팅", ja: "ビジュアルディレクション", en: "Visual direction" }, name: { ko: "마리코", ja: "マリコ", en: "Mariko" } },
  { role: { ko: "아트워크·로고", ja: "アートワーク・ロゴ", en: "Artwork · logo" }, name: { ko: "일본 디자이너 (공개 협의 중)", ja: "日本人デザイナー(公開協議中)", en: "Japanese designer (TBA)" } },
  { role: { ko: "사진·영상", ja: "写真・映像", en: "Photo · video" }, name: { ko: "박치치 감독", ja: "パク・チチ監督", en: "Director Park Chichi" } },
  { role: { ko: "웹사이트", ja: "ウェブサイト", en: "Website" }, name: { ko: "황경하", ja: "ファン・ギョンハ", en: "Hwang Kyeong-ha" } },
];

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

// ── 음악의 뿌리 (리서치 기반, docs/website 06 구조화데이터 연계) ──
export const story: StoryBlock[] = [
  {
    kicker: { ko: "음악의 뿌리 ①", ja: "音楽のルーツ ①", en: "Roots ①" },
    title: { ko: "신중현과 산울림이 우리의 비틀스", ja: "シン・ジュンヒョンとサヌリムが僕らのビートルズ", en: "Shin Joong-hyun & Sanullim are our Beatles" },
    body: {
      ko: "1995년 서울의 음반 가게에서 신중현과 엽전들의 LP를 만난 사토유키에는 한국 록을 직접 무대에서 연구하기로 했다. 신중현은 1955년 미8군 무대에서 출발해 1964년 한국 최초의 록 밴드 '에드 포(Add 4)'를 결성한 한국 록의 아버지다. 1974년 〈미인〉은 1975년 금지곡이 되었다가 1987년에야 해금됐다.",
      ja: "1995年、ソウルのレコード店でシン・ジュンヒョンとヨプチョンドゥルのLPに出会ったサトウユキエは、韓国ロックを自ら舞台で研究すると決めた。シン・ジュンヒョンは1955年に米8軍の舞台から出発し、1964年に韓国初のロックバンド「Add 4」を結成した韓国ロックの父だ。1974年〈美人〉は1975年に禁止曲となり、1987年にようやく解禁された。",
      en: "Encountering an LP by Shin Joong-hyun and the Yup Juns at a Seoul record shop in 1995, Sato Yukie resolved to study Korean rock on stage himself. Shin Joong-hyun — who started on the U.S. 8th Army stages in 1955 and formed Korea's first rock band 'Add 4' in 1964 — is the father of Korean rock. His 1974 song 'Beauty (Miin)' was banned in 1975 and only un-banned in 1987.",
    },
  },
  {
    kicker: { ko: "음악의 뿌리 ②", ja: "音楽のルーツ ②", en: "Roots ②" },
    title: { ko: "트로트, 폭스트롯에서 온 이름", ja: "トロット、フォックストロットから来た名", en: "Trot, a name from the foxtrot" },
    body: {
      ko: "'트로트'라는 이름은 미국 사교춤 음악 '폭스트롯(foxtrot)'에서 왔다. 이난영의 〈목포의 눈물〉(1935)이 식민지기 트로트의 전형을 세웠고, 쇼와 가요를 대표하는 작곡가 고가 마사오는 소년기를 인천·경성에서 보내며 조선의 정서를 흡수했다. 한국 트로트와 일본 엔카는 그렇게 한 세기 동안 서로의 공기를 마셔왔다.",
      ja: "「トロット」という名は、アメリカの社交ダンス音楽「フォックストロット」から来ている。イ・ナニョンの〈木浦の涙〉(1935)が植民地期トロットの典型を確立し、昭和歌謡を代表する作曲家・古賀政男は少年期を仁川・京城で過ごし、朝鮮の情緒を吸収した。韓国のトロットと日本の演歌は、こうして一世紀のあいだ互いの空気を吸ってきた。",
      en: "The name 'trot' comes from the American ballroom music 'foxtrot.' Lee Nan-young's 'Tears of Mokpo' (1935) set the template for colonial-era trot, and Koga Masao — the composer who defined Showa-era kayo — spent his boyhood in Incheon and Seoul, absorbing the sentiment of Korea. Korean trot and Japanese enka have breathed each other's air for a century.",
    },
  },
  {
    kicker: { ko: "음악의 뿌리 ③", ja: "音楽のルーツ ③", en: "Roots ③" },
    title: { ko: "두 나라가 주고받은 소리", ja: "二つの国が交わした音", en: "Sounds the two countries traded" },
    body: {
      ko: "1960년대 미8군 쇼 무대는 신중현·패티김·조용필을 배출한 한국 대중음악의 요람이었고, 1967~69년 일본에서는 '그룹 사운즈' 붐이 J-록의 토대를 놓았다. 1980년대엔 계은숙·조용필이 일본 가요계를 휩쓸었다. 한국에서 일본 대중문화는 1998년에야 단계적으로 열렸다. 마리코 & 유키에의 음악은 그 긴 주고받음의 가장 최근 페이지다.",
      ja: "1960年代の米8軍ショーの舞台はシン・ジュンヒョン・パティ・キム・チョー・ヨンピルを生んだ韓国大衆音楽のゆりかごであり、1967〜69年の日本では「グループ・サウンズ」ブームがJ-ロックの土台を築いた。1980年代にはケイ・ウンスクやチョー・ヨンピルが日本の歌謡界を席巻した。韓国で日本の大衆文化が段階的に開かれたのは1998年。マリコ & ユキエの音楽は、その長い往復の最も新しいページだ。",
      en: "In the 1960s the U.S. 8th Army show stages were the cradle of Korean pop, producing Shin Joong-hyun, Patti Kim and Cho Yong-pil; in Japan, the 1967–69 'Group Sounds' boom laid the foundation of J-rock. In the 1980s Kye Eun-suk and Cho Yong-pil swept the Japanese music scene. Japanese pop culture only opened in Korea, in stages, from 1998. Mariko & Yukie's music is the most recent page of that long exchange.",
    },
  },
];

// ── 남산타워 트리비아 ──
export const towerFacts: { fact: Localized }[] = [
  { fact: { ko: "1969년 착공, 1975년 7월 준공", ja: "1969年着工、1975年7月竣工", en: "Broke ground in 1969, completed July 1975" } },
  { fact: { ko: "탑 높이 236.7m · 해발 포함 약 479.7m", ja: "塔の高さ236.7m・海抜込みで約479.7m", en: "Tower 236.7m · about 479.7m above sea level" } },
  { fact: { ko: "1980년 전망대 첫 일반 개방", ja: "1980年、展望台が初めて一般開放", en: "Observatory first opened to the public in 1980" } },
  { fact: { ko: "'사랑의 자물쇠'로 유명한 야경 명소", ja: "「愛の南京錠」で有名な夜景スポット", en: "A night-view landmark famous for its 'love locks'" } },
];

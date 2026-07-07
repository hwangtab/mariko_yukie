import type { Track } from "./types";

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
    title: { ko: "사랑의 술잔", ja: "愛の盃(韓国語ver.)", en: "Cup of Love" },
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
    title: { ko: "핫 플래시", ja: "ホットフラッシュ(韓国語ver.)", en: "Hot Flash" },
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
    title: { ko: "맥주와 커피", ja: "ビールとコーヒー(韓国語ver.)", en: "Beer and Coffee" },
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
    title: { ko: "남산타워 Namsan Tower Lights", ja: "南山タワー Namsan Tower Lights(韓国語ver.)", en: "Namsan Tower Lights" },
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
    title: { ko: "사랑의 술잔 (일본어)", ja: "愛の盃(日本語ver.)", en: "Cup of Love (Japanese)" },
    type: { ko: "02번 트랙 일본어 버전", ja: "2曲目の日本語バージョン", en: "Japanese version of track 2" },
    body: { ko: ["번역이 아닌 재해석. 일본어로 가장 자연스럽게 전달되도록 다시 썼다."], ja: ["翻訳ではなく再解釈。日本語で最も自然に伝わるよう書き直した。"], en: ["Reinterpretation, not translation — rewritten to land most naturally in Japanese."] },
  },
  {
    number: 12, slug: "hot-flash-ja", language: "ja",
    title: { ko: "핫 플래시 (일본어)", ja: "ホットフラッシュ(日本語ver.)", en: "Hot Flash (Japanese)" },
    type: { ko: "03번 트랙 일본어 버전", ja: "3曲目の日本語バージョン", en: "Japanese version of track 3" },
    body: { ko: ["번역이 아닌 재해석."], ja: ["翻訳ではなく再解釈。"], en: ["Reinterpretation, not translation."] },
  },
  {
    number: 13, slug: "beer-and-coffee-ja", language: "ja",
    title: { ko: "맥주와 커피 (일본어)", ja: "ビールとコーヒー(日本語ver.)", en: "Beer and Coffee (Japanese)" },
    type: { ko: "04번 트랙 일본어 버전", ja: "4曲目の日本語バージョン", en: "Japanese version of track 4" },
    body: { ko: ["번역이 아닌 재해석."], ja: ["翻訳ではなく再解釈。"], en: ["Reinterpretation, not translation."] },
  },
  {
    number: 14, slug: "namsan-tower-ja", language: "ja",
    title: { ko: "남산타워 (일본어)", ja: "南山タワー(日本語ver.)", en: "Namsan Tower (Japanese)" },
    type: { ko: "05번 트랙 일본어 버전", ja: "5曲目の日本語バージョン", en: "Japanese version of track 5" },
    body: { ko: ["같은 멜로디가 두 언어에서 얼마나 다르게 울리는지 — 그 차이 자체가 들을 만한 것이다."], ja: ["同じメロディが二つの言語でどれほど違って響くか — その差そのものが聴きどころだ。"], en: ["How differently the same melody resonates in two languages — that difference itself is worth hearing."] },
  },
  {
    number: 15, slug: "yume-no-hito", language: "ja", isBonus: true,
    title: { ko: "꿈 속에서 본 사람 (일본어)", ja: "夢で逢った男(ひと)", en: "The Person I Saw in a Dream (Japanese)" },
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

import type { Localized } from "@/lib/i18n";
import type { Artist } from "./types";
import { links } from "./links";

// ── 아티스트 ──
export const artists: Artist[] = [
  {
    id: "mariko",
    name: { ko: "마리코", ja: "マリコ", en: "Mariko" },
    roman: "Trot MARIKO",
    tagline: { ko: "트로트를 사랑한 순례자", ja: "トロットを愛した巡礼者", en: "A pilgrim who loved trot" },
    lead: {
      ko: "마리코의 출발점은 드라마였다. 한국 드라마를 본 것이 계기가 되어 한국을 좋아하게 되었고, 여행을 거듭하며 한국 문화에 관심을 갖게 되던 중 텔레비전의 한국 음악 방송에서 트로트를 만났다. 그 순간부터 확신했다 — 내 음악은 이것이라고.",
      ja: "マリコの出発点はドラマだった。韓国ドラマを見たのがきっかけで韓国が好きになり、旅行を重ねて韓国文化への関心を深めるうち、テレビの韓国音楽番組でトロットに出会った。その瞬間から確信した — 私の音楽はこれだと。",
      en: "Mariko's starting point was a drama. Watching Korean dramas made her fall for Korea; as repeated trips deepened her interest in Korean culture, a Korean music program on TV introduced her to trot. From that moment she was certain — this was her music.",
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
        "한국 드라마를 본 것이 계기가 되어 한국을 좋아하게 되었고, 여행을 거듭하며 한국 문화에 관심을 갖게 되던 중 텔레비전의 한국 음악 방송에서 트로트를 만났다. 트로트를 들은 순간부터 '내 음악은 이것'이라고 확신했다.",
        "2009년부터 일본에서 열리는 한국가요 콘테스트에 나가기 시작했다. 2011년에는 전국대회에 출전했다. 수년간 일본에서 한국어 노래를 부르며 실력을 쌓은 뒤 직접 한국으로 건너왔다.",
        "KBS 전국노래자랑 2015년 연말 결산 대회에 출연해 재능을 인정받았고, 2016년 1집 《사랑이랍니다》로 한국 CD 데뷔를 했다. 이후 한국에서 TV·라디오·이벤트·군 위문 공연을, 일본에서는 한국대사관·한일친선협회 공연과 트로트 강사로도 활동했다.",
        "그녀의 목소리에는 80년대 트로트 특유의 것이 있다. 꾸밈음이 자연스럽게 흐르고, 감정이 절제와 넘침 사이를 정확히 오간다. 일본인이기 때문에 오히려 트로트의 본질에 더 가까이 다가간 — 역설적인 순수함이 이 가수의 핵심이다.",
      ],
      ja: [
        "韓国ドラマを見たのがきっかけで韓国が好きになり、旅行を重ねて韓国文化への関心を深めるうち、テレビの韓国音楽番組でトロットに出会った。トロットを聴いた瞬間から「私の音楽はこれだ」と確信した。",
        "2009年から日本で開かれる韓国歌謡コンテストに出場し始めた。2011年には全国大会に出場。数年間、日本で韓国語の歌を歌って実力を積んだのち、自ら韓国へ渡った。",
        "KBS『全国のど自慢』年末決算大会出場で才能を認められ、2016年に1集《サランイラムニダ(愛なんです)》で韓国CDデビュー。以後、韓国でTV・ラジオ・イベント・慰問公演を、日本では韓国大使館・日韓親善協会の公演やトロット講師としても活動した。",
        "彼女の声には80年代トロット特有のものがある。装飾音が自然に流れ、感情が抑制とあふれのあいだを正確に行き来する。日本人だからこそ、かえってトロットの本質に近づいた — 逆説的な純粋さがこの歌手の核心だ。",
      ],
      en: [
        "Watching Korean dramas made her fall for Korea; as repeated trips deepened her interest in Korean culture, a Korean music program on TV introduced her to trot. From the moment she heard it, she was certain — this was her music.",
        "From 2009 she began entering Korean-song contests held in Japan, and competed in the national competition in 2011. After years of singing in Korean in Japan, she crossed over to Korea herself.",
        "She competed in KBS's 2015 year-end National Singing Contest and won recognition; in 2016 she made her Korean CD debut with her first album 'Sarangirannida.' Since then she has performed on Korean TV, radio, events and military shows, and in Japan at the Korean Embassy and Korea–Japan friendship events, also teaching trot.",
        "Her voice carries something unmistakably '80s trot. The ornaments flow naturally; the feeling moves precisely between restraint and overflow. Being Japanese, she paradoxically reaches closer to the essence of trot — that paradoxical purity is the heart of this singer.",
      ],
    },
    links: [
      { label: "Instagram @mariko_1109", href: links.sns.marikoInstagram },
      { label: "Twitter @torotto9", href: links.sns.marikoTwitter },
    ],
    discography: [
      { year: "2016", title: { ko: "사랑이랍니다", ja: "サランイラムニダ(愛なんです)", en: "Sarangirannida" }, note: { ko: "한국 데뷔 CD", ja: "韓国デビューCD", en: "Korean debut CD" } },
      { year: "2021", title: { ko: "트로트 인생", ja: "トロット人生", en: "Trot Life" }, note: { ko: "일본 발매 · 프로듀스 사토유키에", ja: "日本リリース・プロデュース サトウユキエ", en: "Japan release · produced by Sato Yukie" } },
      { year: "2025", title: { ko: "행복이 따로 있나", ja: "こんな幸せは他にない", en: "Is Happiness Elsewhere" }, note: { ko: "2집", ja: "2集", en: "2nd album" } },
    ],
    history: [
      { year: "2009", text: { ko: "한국가요 콘테스트 출전 시작", ja: "韓国歌謡コンテスト出場開始", en: "Began competing in Korean-song contests in Japan" } },
      { year: "2011", text: { ko: "전국대회 출전", ja: "全国大会 出場", en: "Competed in the national competition" } },
      { year: "2015", text: { ko: "KBS 전국노래자랑 2015년 연말 결산 대회 출연", ja: "KBS『全国のど自慢』年末決算大会出場", en: "Competed in KBS's 2015 year-end National Singing Contest" } },
      { year: "2016", text: { ko: "1집 《사랑이랍니다》 — 한국 CD 데뷔", ja: "1集《サランイラムニダ(愛なんです)》— 韓国CDデビュー", en: "1st album 'Sarangirannida' — Korean CD debut" } },
      { year: "2025", text: { ko: "2집 《행복이 따로 있나》 발표", ja: "2集《こんな幸せは他にない》発表", en: "Released 2nd album 'Is Happiness Elsewhere'" } },
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
        "당시 음반 이름에 일본인 이름이 들어가면 안 된다는 규정, 작사·작곡자에 일본인이 포함되면 안 된다는 규정에 부딪혔다.",
        "그는 지금도 서울에 산다. 30년째. 홍대 인디신의 역사이자 산증인이며, 오토모 요시히데·다모 스즈키 등 세계 정상급 프리재즈 뮤지션들과 교류하며 한일 음악 교류의 최전선을 지켰다. 2021년에는 《일본 LP 명반 가이드북》을 한국에서 출판했다.",
      ],
      ja: [
        "彼は韓国ロックを研究するため、日本人だけでバンドを組んだ。名前は「コプチャンチョンゴル」— まだ食べたこともないが美味しそうだという理由で。1999年、韓国初の日本人ロックグループとしてデビューした。",
        "当時、アルバム名に日本人の名前が入ってはならない規定、作詞・作曲者に日本人が含まれてはならない規定にぶつかった。",
        "彼は今もソウルに住む。30年目。ホンデ・インディーシーンの歴史であり生き証人であり、大友良英・ダモ鈴木ら世界トップクラスのフリージャズ・ミュージシャンと交流し、日韓音楽交流の最前線を守った。2021年には《日本LP名盤ガイドブック》を韓国で出版した。",
      ],
      en: [
        "To study Korean rock, he formed a band of all-Japanese members. The name: \"Kopchangjeongol\" — a Korean dish he hadn't even tasted yet but figured had to be delicious. In 1999 they debuted as Korea's first all-Japanese rock group.",
        "Back then he ran into rules: no Japanese name allowed in an album title, no Japanese among the credited songwriters.",
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
      { year: "2021", text: { ko: "《일본 LP 명반 가이드북》 한국 출판", ja: "《日本LP名盤ガイドブック》韓国出版", en: "Published 'Japanese LP Masterpiece Guidebook' in Korea" } },
    ],
  },
];

export function getArtist(id: string) {
  return artists.find((a) => a.id === id);
}

export const duoIntro = {
  ko: "두 사람은 2018년부터 함께 활동해왔다. 사토유키에의 60~70년대 빈티지 그룹 사운드와 마리코의 80년대 트로트 색채가 특정 트랙들에서 자연스럽게 맞물린다. 60~70년대 그룹 사운드와 80년대 트로트 사이에는 사실 그렇게 먼 거리가 없다 — 같은 시대의 공기를 마시고 자란 소리들이다.",
  ja: "ふたりは、2018年から一緒に活動してきた。サトウユキエの60〜70年代ヴィンテージ・グループサウンドと、マリコの80年代トロットの色彩が、曲のなかで自然に溶け込む。60〜70年代グループサウンドと、80年代トロットには、実はそれほど遠いものではない — 同じ時代の空気を吸って育った“音”なのだ。",
  en: "The two have worked together since 2018. Sato Yukie's vintage '60s–'70s group sound and Mariko's '80s trot color lock together naturally on certain tracks. Between '60s–'70s group sound and '80s trot there really isn't much distance — these are sounds that grew up breathing the same era's air.",
} as Localized;

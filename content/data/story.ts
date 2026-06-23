import type { Localized } from "@/lib/i18n";
import type { StoryBlock } from "./types";

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

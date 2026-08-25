/**
 * 같은 이름이 여러 주소로 들어 있는 행의 처리 결정.
 *
 * 규칙으로 자동화하지 않는다. "근거 문자열이 긴 쪽"을 고르면 배순탁에서
 * 틀린다 — 긴 쪽이 "시사IN 편집부 (기고 관련 가능성)"이라는 추측이고,
 * 짧은 쪽이 "배철수의 음악캠프"라는 확실한 사실이다. 판단 근거를 남긴다.
 */
export type DuplicateDecision = {
  name: string;
  keep: string;
  drop: string[];
  why: string;
};

export const DUPLICATE_DECISIONS: DuplicateDecision[] = [
  {
    name: "임진모",
    keep: "ohganzi@gmail.com",
    drop: ["wan-doll@hanmail.net"],
    why: "오간지프로덕션은 본인 회사다. 다른 쪽은 초기 블로그 주소로 표기돼 있다.",
  },
  {
    name: "차우진",
    keep: "dj@tmi.fm",
    drop: ["nar75@naver.com"],
    why: "TMI.FM은 현재 운영하는 뉴스레터다. 다른 쪽 근거는 과거 weiv 활동뿐이다.",
  },
  {
    name: "배순탁",
    keep: "greattak@hanmail.net",
    drop: ["editor@sisain.co.kr"],
    why: "'배철수의 음악캠프'는 확실한 사실이고, 다른 쪽은 잡지 편집부 대표함에 '기고 관련 가능성'이라는 추측이 붙어 있다.",
  },
  {
    name: "최지선",
    keep: "sonicfield@naver.com",
    drop: ["soundscape@empas.com"],
    why: "empas.com은 2009년 네이트 통합으로 종료된 서비스다.",
  },
  {
    name: "이영미",
    keep: "037979@daum.net",
    drop: ["newsshow981@gmail.com"],
    why: "newsshow981은 CBS 라디오 프로그램(98.1MHz) 함으로 보이고 주소가 CBS를 부정한다. 본인 주소로 보낸다.",
  },
  {
    name: "한명륜",
    keep: "evhyjm@gmail.com",
    drop: ["trashfairy@naver.com"],
    why: "두 주소의 근거가 완전히 같아 판단 재료가 없다. 한쪽을 임의로 남긴다.",
  },
  {
    name: "Tamar Herman",
    keep: "tamarhermanwrites@gmail.com",
    drop: ["tamar@billboard.com"],
    why: "근거가 'Variety 기고'라 빌보드 주소는 현재 소속이 아닐 수 있다. 본인 도메인이 안전하다.",
  },
  {
    name: "경기인디뮤직페스티벌 (GIMF)",
    keep: "the_trip@naver.com",
    drop: ["halee@gcon.or.kr"],
    why: "보도 문의용으로 명시된 대표 메일이다. 다른 쪽은 운영·기획 담당자 개인 주소다.",
  },
  {
    name: "한국대중음악학회(KASPM)",
    keep: "kaspmnet@gmail.com",
    drop: ["groovewon.lee@gmail.com"],
    why: "일반 문의 창구다. 다른 쪽은 국제회원 관리 담당이라 음반 보도자료를 받을 자리가 아니다.",
  },
  {
    name: "임진모 (로마자 표기 중복)",
    keep: "ohganzi@gmail.com",
    drop: ["jinmo@izm.co.kr"],
    why: "IZM 창립자 본인 주소다. 이름이 'Lim Jin-mo'로 적혀 있어 한글 표기와 이어지지 않았다.",
  },
  {
    name: "김도헌 (로마자 표기 중복)",
    keep: "doheon@izm.co.kr",
    drop: ["zener1218@gmail.com"],
    why: "'Do Heon Kim'과 같은 사람이다. IZM 편집장이라는 근거를 도메인이 증명하는 쪽을 남긴다.",
  },
  {
    name: "IZM 편집부",
    keep: "doheon@izm.co.kr",
    drop: ["webzineizm@gmail.com"],
    why: "창립자와 편집장에게 각각 보내는 마당에 편집부 함까지 더하면 같은 소수 인원에게 세 통이 간다.",
  },
  {
    name: "리토피아",
    keep: "litopia@hanmail.net",
    drop: ["litopia999@naver.com"],
    why: "한 기관의 메일함 두 개다. 둘 다 개인화 근거가 없어 어느 쪽이든 같다.",
  },
];

/**
 * 이름은 같지만 다른 사람으로 판단한 행. 둘 다 보낸다.
 *
 * 판단 근거는 소속과 이메일 도메인이 각각 일치한다는 것이다. 예를 들어
 * 서정민은 중앙일보 쪽과 한겨레 쪽이 각자 자기 도메인을 쓰고 있다.
 */
export const DISTINCT_PEOPLE: { name: string; emails: string[]; why: string }[] = [
  {
    name: "강수진",
    emails: ["ksj@donga.com", "kanti@kyunghyang.com"],
    why: "동아일보·경향신문 각각 자기 도메인을 쓴다. 흔한 이름이고 소속이 서로 다르다.",
  },
  {
    name: "서정민",
    emails: ["jeongmin@joongang.co.kr", "westmin@hani.co.kr"],
    why: "중앙일보·한겨레 각각 자기 도메인을 쓴다.",
  },
  {
    name: "이진우 (코코플레이 대표, 인사이트 인디 뉴스레터)",
    emails: ["lee@kokoplay.com", "jwlee@munhwa.com"],
    why: "코코플레이 대표와 문화일보 기자로, 소속과 도메인이 각각 일치한다.",
  },
];

/**
 * 보도 매체가 아닌 창구.
 *
 * 예술인 대출·상담 함이나 인력육성 부서에 앨범 보도자료를 보내면
 * 기사가 나오지 않을뿐더러 받는 쪽에 폐가 된다.
 */
/**
 * 한국어를 읽지 않을 가능성이 높은 수신자.
 *
 * 서울 주재 한국어 매체의 한국인 기자는 영문 매체 소속이라도 한국어로 보낸다.
 * 여기 넣는 것은 해외에서 영어로 쓰는 사람과 영문 플랫폼뿐이다.
 */
export const ENGLISH_RECIPIENTS = new Set([
  "jeffbenjaminwrites@gmail.com",
  "tamarhermanwrites@gmail.com",
  "raphael@journalist.net",
  "blog@zzounds.com",
  "write@kpopwise.com",
]);

export const FABRICATED: Exclusion[] = [
  { email: "janedoe@korea.net", reason: "조작 의심 — 역할이 '기자 예시 형식', 이름이 Jane Doe" },
  { email: "sofia@freelance.com", reason: "조작 의심 — freelance.com은 자리표시자 도메인" },
  { email: "a1b2n3@themusictelegraph.com", reason: "조작 의심 — 무작위로 보이는 로컬파트" },
];

export const NOT_PRESS: Exclusion[] = [
  { email: "artloan@kawf.kr", reason: "보도 창구 아님 — 예술인 대출 상담" },
  { email: "counseling@kawf.kr", reason: "보도 창구 아님 — 예술인 상담" },
  { email: "ncas@arko.or.kr", reason: "보도 창구 아님 — 예술인력육성 사업" },
  { email: "music11@arko.or.kr", reason: "보도 창구 아님 — 예술인력육성팀" },
];

/** 발송을 막을 주소와 사유. verify 단계가 채운다. */
export type Exclusion = { email: string; reason: string };

export function duplicateExclusions(): Exclusion[] {
  return DUPLICATE_DECISIONS.flatMap((decision) =>
    decision.drop.map((email) => ({
      email,
      reason: `중복(${decision.name}) — ${decision.keep} 사용`,
    })),
  );
}

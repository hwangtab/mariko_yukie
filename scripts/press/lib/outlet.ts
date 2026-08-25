import type { Contact } from "./contacts";

/**
 * 매체명 → 그 매체가 실제로 쓰는 이메일 도메인 조각.
 *
 * 문화부 리스트의 소속 칸이 행 단위로 어긋나 있다. 병합된 역할이
 * "연합뉴스 / 조선일보 문화부 기자"인데 주소는 @chosun.com인 식이다.
 * 개인화 문장에 매체명을 넣을 때 어느 쪽을 믿을지 판단하려면, 주소가
 * 말하는 것과 텍스트가 말하는 것을 대조해야 한다. 주소는 거짓말하지 않는다.
 */
export const OUTLET_DOMAINS: Record<string, string[]> = {
  KBS: ["kbs.co.kr"],
  MBC: ["mbc.co.kr", "imbc.com"],
  SBS: ["sbs.co.kr"],
  YTN: ["ytn.co.kr"],
  JTBC: ["jtbc.co.kr"],
  CBS: ["cbs.co.kr"],
  연합뉴스: ["yna.co.kr"],
  뉴시스: ["newsis.com"],
  뉴스1: ["news1.kr"],
  한겨레: ["hani.co.kr"],
  조선일보: ["chosun.com", "chosun.kr"],
  중앙일보: ["joongang.co.kr", "joongang.com"],
  동아일보: ["donga.com"],
  경향신문: ["khan.co.kr", "kyunghyang.com"],
  한국일보: ["hankookilbo.com", "koreatimes.com"],
  서울경제: ["sedaily.com", "sed.co.kr"],
  머니투데이: ["mt.co.kr"],
  이데일리: ["edaily.co.kr"],
  파이낸셜뉴스: ["fnnews.com"],
  헤럴드경제: ["heraldcorp.com"],
  아시아투데이: ["asiatoday.co.kr"],
  아시아경제: ["asiae.co.kr"],
  전자신문: ["etnews.com"],
  세계일보: ["segye.com"],
  부산일보: ["busan.com"],
  문화일보: ["munhwa.com", "munhwa.co.kr"],
  아주경제: ["ajunews.com"],
  매일경제: ["mk.co.kr", "mkinternet.com"],
  오마이뉴스: ["ohmynews.com"],
  이투데이: ["etoday.co.kr"],
  국민일보: ["kmib.co.kr"],
  한국경제: ["hankyung.com"],
  프레시안: ["pressian.com"],
};

export type OutletCheck = {
  /** 역할 텍스트에 등장하는 매체 중 주소 도메인과 어긋나는 것들 */
  contradicted: string[];
  /** 주소 도메인이 실제로 가리키는 매체 (알 수 있으면) */
  actual: string | null;
};

function domainOf(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

/**
 * 역할 텍스트가 주장하는 매체를 이메일 도메인과 대조한다.
 *
 * 어긋난 매체명을 개인화 문장에 쓰면 "연합뉴스의 황지윤 기자님께"처럼
 * 대놓고 틀린 메일이 나간다. 좁은 바닥에서 그런 실수는 하루면 돈다.
 */
export function checkOutlet(contact: Contact): OutletCheck {
  const domain = domainOf(contact.email);
  const blob = `${contact.name} ${contact.role}`;

  const actual =
    Object.entries(OUTLET_DOMAINS).find(([, domains]) =>
      domains.some((candidate) => domain.endsWith(candidate)),
    )?.[0] ?? null;

  const contradicted = Object.entries(OUTLET_DOMAINS)
    .filter(([outlet, domains]) => {
      if (!blob.includes(outlet)) return false;
      return !domains.some((candidate) => domain.endsWith(candidate));
    })
    .map(([outlet]) => outlet);

  return { contradicted, actual };
}

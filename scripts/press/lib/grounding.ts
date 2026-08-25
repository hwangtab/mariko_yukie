import type { Contact } from "./contacts";
import { checkOutlet } from "./outlet";

/**
 * 개인화 도입부를 쓸 때 근거로 삼아도 되는 사실들.
 *
 * 문화부 리스트의 소속 칸은 이름·이메일과 무관하게 흘러가는 매체 나열이라
 * 통째로 배제한다. 남는 것은 음악 리스트의 역할 원문, 이메일 도메인이
 * 증명하는 매체, 그리고 이름뿐이다. 여기 없는 사실은 지어낸 것이다.
 */
export type Grounding = {
  name: string;
  /** 음악 리스트가 적어 놓은 역할 원문. 신뢰 가능. */
  statedRole: string;
  /** 이메일 도메인이 증명하는 매체. 주소는 거짓말하지 않는다. */
  verifiedOutlet: string | null;
  /** 도메인과 어긋나 언급하면 안 되는 매체명. */
  forbiddenOutlets: string[];
};

const MUSIC_LIST = "music";

export function groundingFor(contact: Contact): Grounding {
  const { actual, contradicted } = checkOutlet(contact);
  return {
    name: contact.name,
    statedRole: contact.roleBySource[MUSIC_LIST] ?? "",
    verifiedOutlet: actual,
    forbiddenOutlets: contradicted,
  };
}

/** 도입부에 쓸 수 있는 문자열 전체. 검사기가 이 밖의 고유명사를 잡아낸다. */
export function groundedText(contact: Contact): string {
  const g = groundingFor(contact);
  return [g.name, g.statedRole, g.verifiedOutlet ?? ""].join(" ").trim();
}

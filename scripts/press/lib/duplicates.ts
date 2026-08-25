import type { Contact } from "./contacts";

/**
 * 같은 사람으로 보이는 행끼리 묶는다.
 *
 * 주소가 달라도 같은 사람에게 두세 통이 가면 그건 스팸이다. 임진모는 세
 * 주소로, 배순탁·차우진·최지선은 두 주소로 들어 있다.
 *
 * 자동으로 지우지는 않는다. "한국대중음악학회" 두 행은 일반 문의와 국제회원
 * 담당으로 실제로 다른 두 사람이고, 기관명은 여러 담당자가 공유한다.
 * 사람인지 기관인지는 사람이 판단해야 한다.
 */
export function normalizeName(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[（(].*?[)）]/g, "")
    .replace(/[*\s]/g, "")
    .toLowerCase();
}

/** 이름이 비었거나 자리표시자면 묶지 않는다. */
function isGroupable(name: string): boolean {
  const key = normalizeName(name);
  return key.length > 0 && key !== "-" && key !== "–";
}

/**
 * 정규화한 이름이 겹치는 그룹만 돌려준다. 키는 정규화한 이름,
 * 값은 그 이름을 쓰는 이메일 주소들(원본 표기).
 */
export function sameNameGroups(contacts: Contact[]): Map<string, string[]> {
  const byName = new Map<string, string[]>();

  for (const contact of contacts) {
    if (!isGroupable(contact.name)) continue;
    const key = normalizeName(contact.name);
    const bucket = byName.get(key);
    if (bucket) bucket.push(contact.email);
    else byName.set(key, [contact.email]);
  }

  for (const [key, emails] of byName) {
    if (emails.length < 2) byName.delete(key);
  }
  return byName;
}

export type Contact = {
  email: string;
  name: string;
  /** 출처를 합친 표시용 문자열. 분류에는 써도 개인화 근거로는 쓰지 않는다. */
  role: string;
  /**
   * 출처별 역할 원문.
   *
   * 문화부 리스트의 소속 칸은 이름·이메일과 무관하게 따로 흘러가는 매체
   * 나열이다(141~143행이 연합뉴스→연합뉴스(영문)→뉴시스인데 셋 다 조선일보
   * 기자, 155~158행이 조선→중앙→한겨레→한국인데 넷 다 프리랜스 평론가).
   * 합쳐 놓으면 어느 쪽이 사실인지 알 수 없으므로 출처를 보존한다.
   */
  roleBySource: Record<string, string>;
  sources: string[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** 리스트에 마크다운 강조(**이름**)와 앞뒤 공백이 섞여 들어와 있다. */
export function cleanName(raw: string): string {
  return raw.replace(/\*+/g, "").replace(/\s+/g, " ").trim();
}

function columnIndex(header: string[], candidates: string[]): number {
  return header.findIndex((cell) => candidates.includes(cell.trim()));
}

/**
 * 두 리스트를 이메일 소문자 키로 병합한다.
 *
 * 열 순서가 서로 다르다 — 문화부 리스트는 (이름, 이메일, 소속), 음악 리스트는
 * (성명, 역할, 이메일). 그래서 위치가 아니라 헤더 이름으로 열을 찾는다.
 */
export function mergeContacts(inputs: { source: string; rows: string[][] }[]): Contact[] {
  const byKey = new Map<string, Contact>();

  for (const { source, rows } of inputs) {
    if (rows.length === 0) continue;
    const header = rows[0];
    const nameCol = columnIndex(header, ["이름/직함", "성명/조직"]);
    const emailCol = columnIndex(header, ["이메일"]);
    const roleCol = columnIndex(header, ["소속/설명", "역할/소속"]);

    for (const row of rows.slice(1)) {
      const email = (row[emailCol] ?? "").trim();
      if (!isValidEmail(email)) continue;

      const key = email.toLowerCase();
      const name = cleanName(row[nameCol] ?? "");
      const role = cleanName(row[roleCol] ?? "");
      const existing = byKey.get(key);

      if (!existing) {
        // 발송에는 처음 본 원본 표기를 그대로 쓴다. 키만 소문자다.
        byKey.set(key, {
          email,
          name,
          role,
          roleBySource: role ? { [source]: role } : {},
          sources: [source],
        });
        continue;
      }

      if (!existing.name) existing.name = name;
      if (role) {
        existing.roleBySource[source] = existing.roleBySource[source]
          ? `${existing.roleBySource[source]} / ${role}`
          : role;
        if (!existing.role.includes(role)) {
          existing.role = existing.role ? `${existing.role} / ${role}` : role;
        }
      }
      if (!existing.sources.includes(source)) existing.sources.push(source);
    }
  }

  return [...byKey.values()];
}

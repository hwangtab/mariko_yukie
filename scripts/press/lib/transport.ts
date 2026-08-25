import { existsSync, readFileSync } from "node:fs";
import { FROM, REPLY_TO } from "./render";

export type SendResult = { ok: boolean; id?: string; error?: string };

const ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 12_000;

export async function sendOne({
  apiKey,
  to,
  subject,
  html,
  text,
  fetchImpl = fetch,
}: {
  apiKey: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  fetchImpl?: typeof fetch;
}): Promise<SendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: REPLY_TO,
        subject,
        html,
        text,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };

    if (!response.ok) {
      return { ok: false, error: payload.message ?? `HTTP ${response.status}` };
    }
    return { ok: true, id: payload.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 이미 배달된 주소의 집합.
 *
 * 중복 발송이 이 일에서 가장 큰 사고다. 같은 기자에게 같은 메일이 두 번 가면
 * 그 사람에게는 그냥 스팸이다. 실패한 주소는 넣지 않는다 — 재시도해야 한다.
 */
export function loadSentAddresses(logPath: string): Set<string> {
  if (!existsSync(logPath)) return new Set();

  const sent = new Set<string>();
  for (const line of readFileSync(logPath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line) as { email?: string; ok?: boolean };
      if (entry.ok && entry.email) sent.add(entry.email.toLowerCase());
    } catch {
      // 깨진 줄은 무시한다. 로그가 손상돼도 발송은 이어져야 한다.
    }
  }
  return sent;
}

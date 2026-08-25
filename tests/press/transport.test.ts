import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadSentAddresses, sendOne } from "@/scripts/press/lib/transport";

test("posts to the Resend API with the expected envelope", async () => {
  let captured: { url: string; body: Record<string, unknown>; auth: string } | null = null;

  const fakeFetch = (async (url: string | URL, init?: RequestInit) => {
    captured = {
      url: String(url),
      body: JSON.parse(String(init?.body)),
      auth: String((init?.headers as Record<string, string>)?.Authorization),
    };
    return new Response(JSON.stringify({ id: "abc123" }), { status: 200 });
  }) as unknown as typeof fetch;

  const result = await sendOne({
    apiKey: "re_test",
    to: "a@b.com",
    subject: "제목",
    html: "<p>본문</p>",
    text: "본문",
    fetchImpl: fakeFetch,
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "abc123");
  assert.equal(captured!.url, "https://api.resend.com/emails");
  assert.equal(captured!.auth, "Bearer re_test");
  assert.deepEqual(captured!.body.to, ["a@b.com"]);
  assert.equal(captured!.body.reply_to, "hwangtab@gmail.com");
  assert.equal(String(captured!.body.from).includes("alf.seoul.kr"), true);
});

test("surfaces API errors instead of throwing", async () => {
  const failing = (async () =>
    new Response(JSON.stringify({ message: "domain not verified" }), {
      status: 403,
    })) as unknown as typeof fetch;

  const result = await sendOne({
    apiKey: "re_test",
    to: "a@b.com",
    subject: "s",
    html: "h",
    text: "t",
    fetchImpl: failing,
  });

  assert.equal(result.ok, false);
  assert.equal(String(result.error).includes("domain not verified"), true);
});

test("resume set contains only addresses that were delivered", () => {
  const dir = mkdtempSync(join(tmpdir(), "press-"));
  const logPath = join(dir, "send-log.jsonl");
  writeFileSync(
    logPath,
    [
      JSON.stringify({ email: "Sent@X.com", ok: true, id: "1", at: "2026-08-26T00:00:00Z" }),
      JSON.stringify({ email: "failed@x.com", ok: false, error: "boom", at: "2026-08-26T00:00:01Z" }),
    ].join("\n"),
    "utf8",
  );

  const sent = loadSentAddresses(logPath);
  assert.equal(sent.has("sent@x.com"), true, "matching must be case-insensitive");
  assert.equal(sent.has("failed@x.com"), false, "failures must be retryable");
});

test("resume set survives a corrupted log line", () => {
  const dir = mkdtempSync(join(tmpdir(), "press-"));
  const logPath = join(dir, "send-log.jsonl");
  writeFileSync(
    logPath,
    ['{"email":"a@x.com","ok":true}', "{ this is not json", '{"email":"b@x.com","ok":true}'].join("\n"),
    "utf8",
  );
  const sent = loadSentAddresses(logPath);
  assert.equal(sent.has("a@x.com"), true);
  assert.equal(sent.has("b@x.com"), true, "one bad line must not stop the resume set");
});

test("resume set is empty when no log exists yet", () => {
  const dir = mkdtempSync(join(tmpdir(), "press-"));
  assert.equal(loadSentAddresses(join(dir, "nope.jsonl")).size, 0);
});

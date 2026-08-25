import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCsv, toCsv } from "@/scripts/press/lib/csv";

test("parses plain rows", () => {
  assert.deepEqual(parseCsv("a,b\n1,2"), [["a", "b"], ["1", "2"]]);
});

test("keeps commas inside quoted fields", () => {
  assert.deepEqual(
    parseCsv('name,role\n임진모,"대중음악 평론가, 선정위원"'),
    [["name", "role"], ["임진모", "대중음악 평론가, 선정위원"]],
  );
});

test("unescapes doubled quotes", () => {
  assert.deepEqual(parseCsv('a\n"he said ""hi"""'), [["a"], ['he said "hi"']]);
});

test("handles newlines inside quoted fields", () => {
  assert.deepEqual(parseCsv('a,b\n"line1\nline2",x'), [["a", "b"], ["line1\nline2", "x"]]);
});

test("ignores a trailing newline", () => {
  assert.deepEqual(parseCsv("a,b\n1,2\n"), [["a", "b"], ["1", "2"]]);
});

test("strips a UTF-8 BOM", () => {
  assert.deepEqual(parseCsv("﻿a,b\n1,2"), [["a", "b"], ["1", "2"]]);
});

test("round-trips values that need escaping", () => {
  const rows = [["name", "role"], ["임진모", '평론가, "선정위원"']];
  assert.deepEqual(parseCsv(toCsv(rows)), rows);
});

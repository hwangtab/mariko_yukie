import assert from "node:assert/strict";
import { test } from "node:test";
import { checkOutlet } from "@/scripts/press/lib/outlet";

const contact = (email: string, name = "", role = "") => ({
  email,
  name,
  role,
  roleBySource: { culture: role, music: role },
  sources: ["culture", "music"],
});

test("flags an outlet the address contradicts", () => {
  // 실제 행: 문화부 리스트가 "연합뉴스"라고 적었지만 주소는 조선일보다.
  const check = checkOutlet(contact("hwangjiyoon@chosun.com", "황지윤", "연합뉴스 / 조선일보 문화부 기자"));
  assert.deepEqual(check.contradicted, ["연합뉴스"]);
  assert.equal(check.actual, "조선일보");
});

test("accepts an outlet the address confirms", () => {
  const check = checkOutlet(contact("kim@hani.co.kr", "김기자", "한겨레 문화부 기자"));
  assert.deepEqual(check.contradicted, []);
  assert.equal(check.actual, "한겨레");
});

test("flags an outlet claim on a personal address", () => {
  // 임진모는 프리랜스 평론가인데 리스트가 중앙일보를 붙여 놓았다.
  const check = checkOutlet(contact("ohganzi@gmail.com", "임진모", "중앙일보 / 대중음악 평론가"));
  assert.deepEqual(check.contradicted, ["중앙일보"]);
  assert.equal(check.actual, null);
});

test("says nothing when no outlet is named", () => {
  const check = checkOutlet(contact("someone@gmail.com", "김작가", "noise"));
  assert.deepEqual(check.contradicted, []);
  assert.equal(check.actual, null);
});

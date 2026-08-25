import assert from "node:assert/strict";
import { test } from "node:test";
import { groundedText, groundingFor } from "@/scripts/press/lib/grounding";

const 임진모 = {
  email: "ohganzi@gmail.com",
  name: "임진모",
  role: "중앙일보 / 대중음악 평론가, 오간지프로덕션 소속 강연자",
  roleBySource: {
    culture: "중앙일보",
    music: "대중음악 평론가, 오간지프로덕션 소속 강연자",
  },
  sources: ["culture", "music"],
};

test("drops the culture list's outlet column entirely", () => {
  const g = groundingFor(임진모);
  assert.equal(g.statedRole, "대중음악 평론가, 오간지프로덕션 소속 강연자");
  assert.equal(g.statedRole.includes("중앙일보"), false);
  assert.deepEqual(g.forbiddenOutlets, ["중앙일보"]);
  assert.equal(g.verifiedOutlet, null);
});

test("grounded text carries no outlet the address cannot confirm", () => {
  assert.equal(groundedText(임진모).includes("중앙일보"), false);
  assert.equal(groundedText(임진모).includes("대중음악 평론가"), true);
});

test("keeps an outlet the address confirms", () => {
  const g = groundingFor({
    email: "doheon@izm.co.kr",
    name: "Do Heon Kim",
    role: "한국경제 / 음악 비평/기자 (IZM 편집장)",
    roleBySource: { culture: "한국경제", music: "음악 비평/기자 (IZM 편집장)" },
    sources: ["culture", "music"],
  });
  assert.equal(g.statedRole, "음악 비평/기자 (IZM 편집장)");
  assert.deepEqual(g.forbiddenOutlets, ["한국경제"]);
});

test("a culture-only contact has no stated role to lean on", () => {
  const g = groundingFor({
    email: "hwangjiyoon@chosun.com",
    name: "황지윤",
    role: "연합뉴스",
    roleBySource: { culture: "연합뉴스" },
    sources: ["culture"],
  });
  assert.equal(g.statedRole, "");
  assert.equal(g.verifiedOutlet, "조선일보", "the address is the only trustworthy outlet signal");
  assert.deepEqual(g.forbiddenOutlets, ["연합뉴스"]);
});

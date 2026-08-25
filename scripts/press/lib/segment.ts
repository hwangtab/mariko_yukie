import type { Contact } from "./contacts";

export type Segment =
  | "critic"
  | "music-press"
  | "culture-desk"
  | "generic-desk"
  | "art-press"
  | "unknown";

/** 1차 발송 대상. 배열 순서가 곧 발송 우선순위다. */
export const WAVE_ONE: Segment[] = ["critic", "music-press", "culture-desk"];

export const SEGMENT_ORDER: Segment[] = [
  "critic",
  "music-press",
  "culture-desk",
  "generic-desk",
  "art-press",
  "unknown",
];

/** "음악 관계자, 기자, 평론가" 리스트. 여기 실렸다는 것 자체가 음악 관련이라는 신호다. */
const MUSIC_LIST = "music";

/**
 * 사람이 읽지 않는 인프라 주소. 어떤 신호가 붙어도 개인화 메일을 보내지 않는다.
 */
const INFRA_INBOX =
  /^(jebo|hotline|voc|webmaster|master|help|mail|newsroom|onlinenews|ad|society|economy|culture|desk|contents?|news\d*)@/i;

/**
 * 편집용 대표함. 큰 신문사에서는 데스크 창구지만, 작은 음악 웹진·레이블·
 * 페스티벌에서는 이것이 유일한 정식 창구다. Rolling Stone Korea의 contact@,
 * Indie Post의 editor@, HipHopPlaya의 press@가 그렇다. 음악 신호가 붙어 있으면
 * 사람이 아니라 매체 앞으로 보내되 대상에서 빼지는 않는다.
 */
const EDITORIAL_INBOX = /^(editor|press|contact|write|info|music)@/i;

/**
 * 미술 매체. 대중음악 앨범을 보내면 그냥 스팸이다.
 *
 * "미술"을 통으로 잡되 "예술"은 잡지 않는다 — 예술은 음악을 포함하는 상위어라
 * 예술해방전선·한국예술종합학교 같은 곳까지 걷어내게 된다. 음악 리스트 201명에
 * "미술"이 걸리는 행은 한 명도 없음을 확인했다.
 */
const VISUAL_ART = /미술|시각예술|ART IN CULTURE|THE ARTRO|아트로|아트조선|갤러리|큐레이터/i;

const MUSIC_CRITIC =
  /대중음악\s*평론|음악\s*평론|평론가|선정위원|한국대중음악상|음악\s*저널리스트|온음|weiv|izm|ears\s*mag|Writer/i;

const MUSIC_BEAT =
  /대중음악|음악|인디|페스티벌|K-?pop|케이팝|밴드|레이블|앨범|재즈|아이돌|음반|공연\s*담당/i;

const CULTURE_BEAT = /문화|예술|공연|영화|방송|연예/i;

/**
 * 순서가 곧 규칙이다.
 *
 * 부서 대표함 판정이 가장 먼저다 — 설명에 "문화 데스크"라고 적혀 있어도
 * jebo@는 사람이 아니라 함이므로 개인화 메일을 보내면 안 된다.
 *
 * 미술 배제가 음악 판정보다 먼저다 — "미술 평론가"가 critic으로 새면
 * 현대미술 매체에 대중음악 앨범이 날아간다.
 *
 * 그다음이 리스트 출처다. 원본의 역할 칸에는 "bo-da", "noise", "10asia",
 * "100beat.com"처럼 매체명만 적힌 행이 많아, 문자열만 보면 김작가·김학선·
 * 권석정 같은 대중음악 평론가가 통째로 unknown에 빠진다. 음악 리스트 201명에
 * 미술 관련이 한 명도 없다는 것을 확인했으므로, 그 리스트 소속이라는 사실만으로
 * 최소 music-press로 본다.
 */
export function classify(contact: Contact): Segment {
  const local = `${contact.email.split("@")[0]}@`;
  if (INFRA_INBOX.test(local)) return "generic-desk";

  const blob = `${contact.name} ${contact.role}`.trim();
  const fromMusicList = contact.sources.includes(MUSIC_LIST);
  const musicSignal = fromMusicList || MUSIC_CRITIC.test(blob) || MUSIC_BEAT.test(blob);

  if (VISUAL_ART.test(blob)) return "art-press";
  if (EDITORIAL_INBOX.test(local) && !musicSignal) return "generic-desk";

  if (MUSIC_CRITIC.test(blob)) return "critic";
  if (MUSIC_BEAT.test(blob)) return "music-press";
  if (fromMusicList) return "music-press";
  if (!blob) return "unknown";
  if (CULTURE_BEAT.test(blob)) return "culture-desk";
  return "unknown";
}

/** 사람이 아니라 매체·조직 앞으로 써야 하는 주소인가. draft 단계가 호칭을 가른다. */
export function isOrganizationInbox(contact: Contact): boolean {
  return EDITORIAL_INBOX.test(`${contact.email.split("@")[0]}@`);
}

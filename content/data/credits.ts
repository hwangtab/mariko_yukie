import type { Localized } from "@/lib/i18n";
import { productionCredits } from "./production";

// ── 크레딧 ──
export const credits: { role: Localized; name: Localized }[] = [
  { role: { ko: "아티스트 / 작사·작곡·연주", ja: "アーティスト / 作詞・作曲・演奏", en: "Artists / writing · composing · performance" }, name: { ko: "마리코, 사토유키에", ja: "マリコ、佐藤行衛", en: "Mariko, Sato Yukie" } },
  { role: { ko: "프로듀스", ja: "プロデュース", en: "Produced by" }, name: productionCredits.producer },
  { role: { ko: "레코딩 스튜디오", ja: "レコーディングスタジオ", en: "Recording Studio" }, name: productionCredits.recordingStudio },
  { role: { ko: "믹싱 스튜디오", ja: "ミキシングスタジオ", en: "Mixing Studio" }, name: productionCredits.mixingStudio },
  { role: { ko: "마스터링 스튜디오", ja: "マスタリングスタジオ", en: "Mastering Studio" }, name: productionCredits.masteringStudio },
  { role: { ko: "레코딩 디렉터", ja: "レコーディングディレクター", en: "Recording Director" }, name: productionCredits.recordingDirector },
  { role: { ko: "믹싱 엔지니어", ja: "ミキシングエンジニア", en: "Mixing Engineer" }, name: productionCredits.mixingEngineer },
  { role: { ko: "마스터링 엔지니어", ja: "マスタリングエンジニア", en: "Mastering Engineer" }, name: productionCredits.masteringEngineer },
  { role: { ko: "기획·제작·운영", ja: "企画・制作・運営", en: "Planning · production · operation" }, name: productionCredits.planningProduction },
  { role: { ko: "비주얼 디렉팅", ja: "ビジュアルディレクション", en: "Visual direction" }, name: { ko: "마리코", ja: "マリコ", en: "Mariko" } },
  { role: { ko: "오리지널 아트워크 & 디자인", ja: "オリジナルアートワーク & デザイン", en: "Original Artwork & Design" }, name: productionCredits.originalArtworkDesign },
  { role: { ko: "사진·영상·뮤직비디오", ja: "写真・映像・MV", en: "Photo · video · music video" }, name: { ko: "치치", ja: "チチ", en: "Chichi" } },
  { role: { ko: "웹사이트", ja: "ウェブサイト", en: "Website" }, name: { ko: "황경하", ja: "ファン・ギョンハ", en: "Hwang Kyeong-ha" } },
];

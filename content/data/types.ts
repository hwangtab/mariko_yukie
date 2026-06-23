import type { Localized } from "@/lib/i18n";

export interface DiscoRow {
  year: string;
  title: Localized;
  note?: Localized;
}
export interface HistoryRow {
  year: string;
  text: Localized;
}
export interface Artist {
  id: "mariko" | "yukie";
  name: Localized;
  roman: string;
  tagline: Localized;
  lead: Localized;
  body: Localized<string[]>;
  quote?: Localized;
  photo: string;
  gallery: string[];
  links: { label: string; href: string }[];
  discography: DiscoRow[];
  history: HistoryRow[];
}
export interface Track {
  number: number;
  slug: string;
  title: Localized;
  type: Localized;
  language: "ko" | "ja";
  isTitle?: boolean;
  isBonus?: boolean;
  hasMV?: boolean;
  pull?: Localized;
  body: Localized<string[]>;
  image?: string;
}
export interface GalleryItem {
  file: string;
  caption: Localized;
}
export interface StoryBlock {
  kicker: Localized;
  title: Localized;
  body: Localized;
}
export interface SpecRow {
  label: Localized;
  value: Localized;
}
export interface EventItem {
  id: string;
  type: "release" | "tour" | "news";
  title: Localized;
  dateLabel: Localized;
  venue: Localized;
  note: Localized;
  status: "tentative" | "confirmed" | "past";
}

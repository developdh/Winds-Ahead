import research from "@/content/research.json";
import media from "@/content/media.json";
import localizations from "@/content/localizations.json";
export type Locale = "en" | "ko";
export type Server = "CN" | "Global";
export type Bilingual = { en: string; ko: string };
export interface Acquisition extends Bilingual {
  sourceExcerpt?: string;
  kind: "shop" | "exchange" | "exchange_shop" | "limited_draw" | "seasonal_draw" | "battle_pass" | "milestone" | "event" | "exploration" | "quest" | "achievement" | "sect" | "unknown";
  pricing: "fixed" | "draw" | "pass" | "free" | "unknown";
  amount: number | null;
  regularAmount: number | null;
  currencyOriginal: string | null;
  location: Bilingual & { original: string };
  conditions: Bilingual | null;
}
export interface Cosmetic {
  id: string;
  nameOriginal: string;
  romanization: string;
  category: "outfit" | "hair" | "weapon_skin" | "effect" | "accessory" | "mount";
  sourceId: string;
  acquisitionServer?: Server;
  mediaServer?: Server;
  mediaKind?: "official" | "gameplay";
  mediaStatus?: "pending" | "verified";
  namingNote?: Bilingual;
  searchAliases?: string[];
  sourceEvidence?: string;
  imageSourceUrl?: string;
  officialNameEn: string | null;
  officialNameKo: string | null;
  cnRelease: { date: string | null; precision: "day" | "unknown"; timezone: null; contextual: boolean; basis: string };
  acquisition: Acquisition;
  global: { status: string; releaseDate: string | null; officialName: string | null };
  images: { url: string; width: number; height: number; reusePermission: string }[];
  officialVideos: typeof research.cosmetics[number]["officialVideos"];
}
export const source = research.sources[0];
export const verifiedAt = research.verifiedAt;
export const cosmetics = research.cosmetics as Cosmetic[];
export const categoryNames = {
  all: { en: "All", ko: "전체" },
  outfit: { en: "Outfits", ko: "의상" },
  hair: { en: "Hair", ko: "헤어" },
  weapon_skin: { en: "Weapons", ko: "무기" },
  effect: { en: "Effects", ko: "이펙트" },
  accessory: { en: "Accessories", ko: "장신구" },
  mount: { en: "Mounts", ko: "탈것" },
};
export type Category = keyof typeof categoryNames;
const localeData: Record<
  string,
  { koName: string; description: { en: string; ko: string } }
> = localizations;
export const aliases: Record<string, string> = Object.fromEntries(
  Object.entries(localeData).map(([id, value]) => [id, value.koName]),
);
export const descriptions: Record<string, { en: string; ko: string }> =
  Object.fromEntries(
    Object.entries(localeData).map(([id, value]) => [id, value.description]),
  );
export interface Source {
  id: string; url: string; publisher: string; server: Server; titleOriginal: string;
  displayedPublicationDate: string | null; evidenceTier?: "A" | "B" | "C";
}
export function sourceOf(c: Cosmetic) {
  return (research.sources as Source[]).find((s) => s.id === c.sourceId)!;
}
export function nameOf(c: Cosmetic, l: Locale) {
  return l === "ko" ? c.officialNameKo ?? aliases[c.id] : c.officialNameEn ?? c.romanization;
}
export function imagesOf(c: Cosmetic) {
  return media.filter((m) => m.cosmeticId === c.id);
}
export function findCosmetic(id: string) {
  return cosmetics.find((c) => c.id === id);
}
export function searchCosmetics(query: string, category: string = "all") {
  const q = query.normalize("NFKC").toLocaleLowerCase().trim();
  return cosmetics.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      [
        c.nameOriginal,
        ...(c.searchAliases ?? []),
        c.romanization,
        c.officialNameEn,
        c.officialNameKo,
        aliases[c.id],
        descriptions[c.id].en,
        descriptions[c.id].ko,
      ]
        .join(" ")
        .normalize("NFKC")
        .toLocaleLowerCase()
        .includes(q),
  );
}
export function formatDay(date: string | null, l: Locale) {
  if (!date) return l === "ko" ? "날짜 미정" : "Date unknown";
  return new Intl.DateTimeFormat(l === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}
export const pageNames = {
  catalog: { en: "Cosmetic archive", ko: "외관 도감" },
  calendar: { en: "Release roadmap", ko: "출시 로드맵" },
  watchlist: { en: "Your watchlist", ko: "관심 외관" },
  updates: { en: "Archive updates", ko: "업데이트" },
  about: { en: "About this archive", ko: "연운경 소개" },
};
export type View = keyof typeof pageNames | "detail";

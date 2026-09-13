import research from "@/content/research.json";
import media from "@/content/media.json";
import localizations from "@/content/localizations.json";
export type Locale = "en" | "ko";
export type Cosmetic = (typeof research.cosmetics)[number];
export const source = research.sources[0];
export const verifiedAt = research.verifiedAt;
export const cosmetics = research.cosmetics;
export const categoryNames = {
  all: { en: "All", ko: "전체" },
  outfit: { en: "Outfits", ko: "의상" },
  hair: { en: "Hair", ko: "헤어" },
  weapon_skin: { en: "Weapons", ko: "무기" },
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
export function sourceOf(c: Cosmetic) {
  return research.sources.find((s) => s.id === c.sourceId)!;
}
export function nameOf(c: Cosmetic, l: Locale) {
  return l === "ko" ? aliases[c.id] : c.romanization;
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
        c.romanization,
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

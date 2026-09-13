import research from "@/content/research.json";
import media from "@/content/media.json";
export type Locale = "en" | "ko";
export type Cosmetic = (typeof research.cosmetics)[number];
export const source = research.sources[0];
export const verifiedAt = research.verifiedAt;
export const cosmetics = research.cosmetics;
export const categoryNames = {
  all: { en: "All cosmetics", ko: "전체" },
  outfit: { en: "Outfits", ko: "의상" },
  hair: { en: "Hairstyles", ko: "헤어" },
  weapon_skin: { en: "Weapons", ko: "무기 외형" },
};
export type Category = keyof typeof categoryNames;
export const aliases: Record<string, string> = {
  "zui-penglai": "취봉래",
  "qing-fangzun": "경방준",
  zongheng: "종횡",
  chongming: "중명",
  jumang: "구망",
  "tianzhi-minggui": "천지명귀",
  "yunzhong-jinshu": "운중금서",
  "cangyin-xihe-qiaori": "장음 · 희화교일",
};
export const descriptions: Record<string, { en: string; ko: string }> = {
  "zui-penglai": {
    en: "Pale silk, flowing aqua accents, and a touch of the ethereal.",
    ko: "옅은 비단과 물빛 장식이 어우러진 신선의 옷차림.",
  },
  "qing-fangzun": {
    en: "White hair gathered with delicate, pale ornaments.",
    ko: "섬세한 장식으로 정돈한 백색 머리.",
  },
  zongheng: {
    en: "Crimson and gold, framed by a dramatic fur collar.",
    ko: "붉은빛과 금빛, 풍성한 털 장식의 강렬한 조화.",
  },
  chongming: {
    en: "Dark hair with gold ornaments and crimson details.",
    ko: "검은 머리 위로 더해진 금색 장식과 붉은 포인트.",
  },
  jumang: {
    en: "Deep teal and bronze with intricate bird-inspired details.",
    ko: "짙은 청록과 청동빛으로 풀어낸 정교한 새의 형상.",
  },
  "tianzhi-minggui": {
    en: "Cool blue hair with sculpted, ornamental details.",
    ko: "차가운 푸른빛과 조형적인 장식이 돋보이는 머리.",
  },
  "yunzhong-jinshu": {
    en: "A scholar’s silhouette in white, black, and flowing ink.",
    ko: "먹빛 무늬가 흐르는 흑백의 단아한 문인 차림.",
  },
  "cangyin-xihe-qiaori": {
    en: "A luminous blade with blue-white and fiery alternate forms.",
    ko: "푸른 광채와 불꽃빛 변형을 지닌 도검 외형.",
  },
};
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

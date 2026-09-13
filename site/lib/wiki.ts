import type { Bilingual } from "./catalog";
export interface WikiDetails {
  schemaVersion: 1;
  cosmeticId: string;
  titleOriginal: string;
  sourceUrl: string;
  revisionUrl: string | null;
  checkedAt: string;
  license: "CC BY-NC-SA 3.0";
  articleAvailable: boolean;
  category: "sets" | "weapon" | "effect" | "mount";
  grade: Bilingual | null;
  gradeOriginal: string | null;
  styleScore: number | null;
  flags: Record<"dye" | "tailoring" | "gifting" | "trading", boolean | null>;
  components: { nameOriginal: string; label: Bilingual; styleScore: number | null; sourceUrl: string | null }[];
  reportedComponentCount: number | null;
  collectionReward: { amount: number; currencyOriginal: string; currency: Bilingual } | null;
  resultsAnimation: { available: boolean; styleScore: number | null } | null;
  acquisition: (Bilingual & { original: string }) | null;
  timing: (Bilingual & { original: string; timezone: null }) | null;
  weapon: (Bilingual & { original: string }) | null;
  martialArt: string | null;
  replacedMove: string | null;
  mountType: (Bilingual & { original: string }) | null;
  sourceFields: Record<string, string>;
  additionalNote?: Bilingual;
}

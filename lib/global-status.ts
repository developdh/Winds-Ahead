import data from "@/content/global-events.json";
import type { ReleaseEvent } from "@/lib/roadmap";
import type { Locale } from "@/lib/catalog";
export function globalEventFor(id: string) {
  return [...(data.events as ReleaseEvent[])]
    .filter((e) => e.cosmeticId === id && e.status !== "cancelled")
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}
export function globalLabel(id: string, l: Locale) {
  const e = globalEventFor(id);
  return e
    ? e.status === "released"
      ? l === "ko"
        ? "글로벌 · 출시 기록"
        : "Global · Released"
      : l === "ko"
        ? "글로벌 · 출시 발표"
        : "Global · Announced"
    : l === "ko"
      ? "글로벌 · 확인 중"
      : "Global · Not verified";
}
export const globalSources = data.sources as {
  id: string;
  url: string;
  titleOriginal: string;
  publisher: string;
}[];

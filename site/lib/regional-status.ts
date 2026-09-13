import data from "@/content/regional-records.json";
import { sourceOf, type Cosmetic, type Locale, type Server } from "@/lib/catalog";
export type RegionalState = "released" | "announced" | "unknown";
export interface RegionalRecord {
  cosmeticId: string;
  server: Server;
  status: Exclude<RegionalState, "unknown">;
  sourceIds: string[];
  verifiedAt: string;
  releaseDate: string | null;
  precision: "day" | "unknown";
  scope: { en: string; ko: string };
  identityBasis: { en: string; ko: string };
}
export const regionalRecords = data.records as RegionalRecord[];
const records = new Map(regionalRecords.map(r => [`${r.cosmeticId}:${r.server}`, r]));
export function regionalRecord(c: Cosmetic, server: Server): RegionalRecord | undefined {
  const record = records.get(`${c.id}:${server}`);
  if (record) return record;
  if (server === "CN" && sourceOf(c).server === "CN") return {
    cosmeticId: c.id, server, status: "released", sourceIds: [c.sourceId],
    verifiedAt: data.verifiedAt, releaseDate: c.cnRelease.date, precision: c.cnRelease.precision,
    scope: { en: "Historical CN appearance listing. Current availability is not established.", ko: "중국의 과거 외관 출시 기록입니다. 현재 판매 여부는 별도입니다." },
    identityBasis: { en: "Named appearance in the linked CN source.", ko: "중국 원문에서 이름과 외관을 확인했습니다." },
  };
}
export function serverName(server: Server, l: Locale) {
  return server === "CN" ? l === "ko" ? "중국" : "China" : l === "ko" ? "글로벌" : "Global";
}
export function stateName(status: RegionalState, l: Locale) {
  return status === "released" ? l === "ko" ? "출시 확인" : "Released" : status === "announced" ? l === "ko" ? "발표됨" : "Announced" : l === "ko" ? "확인 중" : "Not verified";
}
export function releasedOn(c: Cosmetic, server: Server) {
  return regionalRecord(c, server)?.status === "released";
}
export function matchesServer(c: Cosmetic, filter: string) {
  return filter === "cn" ? releasedOn(c, "CN") : filter === "global" ? releasedOn(c, "Global") : filter === "both" ? releasedOn(c, "CN") && releasedOn(c, "Global") : true;
}
export function latestRelease(c: Cosmetic) {
  return [c.cnRelease.date, regionalRecord(c, "Global")?.releaseDate].filter(Boolean).sort().at(-1) ?? "";
}

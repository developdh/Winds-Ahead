import data from "@/content/regional-records.json";
import { releaseState, matchesReleaseFilter } from './regional-domain.mjs';
import { sourceOf, type Cosmetic, type Locale, type Server, type Acquisition } from "@/lib/catalog";
export type RegionalState = "released" | "announced" | "pending" | "unknown";
export interface RegionalRecord {
  cosmeticId: string;
  server: Server;
  status: "released" | "announced";
  confirmationPending?: boolean;
  sourceIds: string[];
  verifiedAt: string;
  releaseDate: string | null;
  precision: "day" | "unknown";
  scope: { en: string; ko: string };
  identityBasis: { en: string; ko: string };
  acquisition?: Acquisition;
}
export const regionalRecords = data.records as RegionalRecord[];
const records = new Map(regionalRecords.map(r => [`${r.cosmeticId}:${r.server}`, r]));
export function regionalRecord(c: Cosmetic, server: Server): RegionalRecord | undefined {
  const record = records.get(`${c.id}:${server}`);
  if (record) return record;
  if (server === "CN" && c.cnRelease.date && sourceOf(c).server === "CN" && sourceOf(c).kind !== "community" && sourceOf(c).evidenceTier !== "C" && sourceOf(c).evidenceTier !== "B") return {
    cosmeticId: c.id, server, status: c.cnRelease.date > data.verifiedAt ? "announced" : "released", sourceIds: [c.sourceId],
    verifiedAt: data.verifiedAt, releaseDate: c.cnRelease.date, precision: c.cnRelease.precision,
    scope: { en: "Dated CN appearance listing. See the release status; current availability is not established.", ko: "날짜가 확인된 중국 외관 공지입니다. 출시 상태를 함께 확인하세요. 현재 판매 여부는 별도입니다." },
    identityBasis: { en: "Named appearance in the linked CN source.", ko: "중국 원문에서 이름과 외관을 확인했습니다." },
  };
}
export function serverName(server: Server, l: Locale) {
  return server === "CN" ? l === "ko" ? "중국" : "China" : l === "ko" ? "글로벌" : "Global";
}
export function stateName(status: RegionalState, l: Locale) {
  return status === "released" ? l === "ko" ? "출시 확인" : "Released" : status === "announced" ? l === "ko" ? "출시 예정" : "Scheduled" : status === "pending" ? l === "ko" ? "출시 확인 중" : "Release unverified" : l === "ko" ? "확인 중" : "Not verified";
}
export function regionalState(c: Cosmetic, server: Server, today = data.verifiedAt): RegionalState {
  return releaseState(regionalRecord(c, server), today || data.verifiedAt);
}
export function releasedOn(c: Cosmetic, server: Server, today = data.verifiedAt) {
  return regionalState(c, server, today) === "released";
}
export function matchesServer(c: Cosmetic, filter: string, today = data.verifiedAt) {
  return matchesReleaseFilter(regionalRecord(c, "CN"), regionalRecord(c, "Global"), filter, today || data.verifiedAt);
}
export function latestRelease(c: Cosmetic) {
  return [c.cnRelease.date, regionalRecord(c, "Global")?.releaseDate].filter(Boolean).sort().at(-1) ?? "";
}

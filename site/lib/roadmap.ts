import forecastData from "@/content/forecasts.json";
import globalData from "@/content/global-events.json";
import { cosmetics } from "@/lib/catalog";
import research from "@/content/research.json";
export interface Forecast {
  id: string;
  revision: number;
  cosmeticId: string;
  state: "active" | "withdrawn" | "superseded";
  precision: "month" | "window" | "version";
  month?: string;
  start?: string;
  end?: string;
  version?: string;
  evidenceLevel: "limited" | "supported";
  rationale: { en: string; ko: string };
  assumptions: { en: string; ko: string };
  reason: { en: string; ko: string };
  sourceIds: string[];
  createdAt: string;
  reviewDue: string;
}
export interface ReleaseEvent {
  id: string;
  cosmeticId: string;
  date: string;
  precision: "day";
  server: "CN" | "Global";
  kind: "release" | "rerun";
  sourceIds: string[];
  status: "announced" | "released" | "cancelled";
  scope: { en: string; ko: string };
}
export const scheduleReviewedAt = forecastData.reviewedAt;
export const forecasts = forecastData.revisions as Forecast[];
export const globalEvents = globalData.events as ReleaseEvent[];
export const sources = [...research.sources, ...globalData.sources] as {
  id: string;
  url: string;
  titleOriginal: string;
  publisher: string;
  server: string;
}[];
export const cnEvents: ReleaseEvent[] = cosmetics
  .filter((c) => c.cnRelease.date)
  .map((c) => ({
    id: `cn-${c.id}-${c.cnRelease.date!.replaceAll("-", "")}`,
    cosmeticId: c.id,
    date: c.cnRelease.date!,
    precision: "day",
    server: "CN",
    kind: "release",
    sourceIds: [c.sourceId],
    status: "released",
    scope: {
      en: c.cnRelease.contextual ? "CN server · day derived from update context" : "CN server · date only; time zone not stated",
      ko: c.cnRelease.contextual ? "중국 서버 · 업데이트 문맥으로 확인한 날짜" : "중국 서버 · 날짜 단위. 시간대 미표기",
    },
  }));

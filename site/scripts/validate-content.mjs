import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { isDay, isMonth } from "../lib/roadmap-domain.mjs";
import { readWiki, validateWiki } from "./validate-wiki.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const terminology = JSON.parse(fs.readFileSync(path.join(root, "content/terminology.json"), "utf8"));
const bilingual = z.object({
  en: z.string().trim().min(1),
  ko: z.string().trim().min(1),
});
const day = z.string().refine(isDay, "Use a real YYYY-MM-DD date");
z.record(bilingual).parse(terminology.currencies);
export const acquisitionSchema = bilingual.extend({
  kind: z.enum(["shop", "exchange", "exchange_shop", "limited_draw", "seasonal_draw", "battle_pass", "milestone", "event", "exploration", "quest", "achievement", "sect", "unknown"]),
  pricing: z.enum(["fixed", "draw", "pass", "free", "unknown"]),
  amount: z.number().int().positive().nullable(),
  regularAmount: z.number().int().positive().nullable(),
  currencyOriginal: z.string().refine(v => Object.hasOwn(terminology.currencies, v), "Unknown currency").nullable(),
  location: bilingual.extend({ original: z.string().trim().min(1) }),
  conditions: bilingual.nullable(),
}).passthrough().superRefine((a, ctx) => {
  const bad = message => ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  const expected = ["limited_draw", "seasonal_draw"].includes(a.kind) ? "draw" : a.kind === "battle_pass" ? "pass" : a.kind === "milestone" ? "unknown" : "fixed";
  const reward = ["event", "exploration", "quest", "achievement", "sect"].includes(a.kind);
  const unpriced = a.pricing === "unknown" && !["limited_draw", "seasonal_draw"].includes(a.kind);
  const free = a.pricing === "free" && reward && a.conditions !== null;
  if (a.pricing !== expected && !unpriced && !free) bad("Pricing must match the acquisition method");
  if (a.pricing === "unknown" && !a.conditions) bad("Unknown amounts require source context");
  if (a.pricing === "fixed" && (a.amount === null || a.currencyOriginal === null)) bad("Fixed costs need a quantity and currency");
  if (a.pricing !== "fixed" && (a.amount !== null || a.regularAmount !== null)) bad("Unverified prices and reward totals must remain null");
  if (a.pricing === "draw" && a.currencyOriginal === null && !a.conditions) bad("An unknown draw currency requires source context");
  if (a.regularAmount !== null && (a.amount === null || a.regularAmount <= a.amount)) bad("A discount must be below its regular price");
});
const sourceSchema = z
  .object({
    id: z.string().min(1),
    url: z.string().url().startsWith("https://"),
    publisher: z.string().min(1),
    server: z.enum(["CN", "Global"]),
    titleOriginal: z.string().min(1),
  })
  .passthrough();
export const videoSchema = z
  .object({
    provider: z.enum(["youtube", "bilibili", "netease"]),
    id: z.string(),
    watchUrl: z.string().url(),
    title: bilingual,
    sourceId: z.string().min(1),
    playback: z.object({
      src: z.string().regex(/^\/media\/videos\/[a-z0-9-]+\.mp4$/),
      poster: z.string().regex(/^\/media\/[a-z0-9-]+\.webp$/),
      bytes: z.number().int().positive().max(8_000_000),
      width: z.number().int().positive().max(1280),
      height: z.number().int().positive().max(720),
      durationSeconds: z.number().positive().max(60),
    }).strict().optional(),
    originalBytes: z.number().int().positive().optional(),
    visuallyInspected: z.literal(true).optional(),
    inspectionNote: z.string().min(1).optional(),
    reusePermission: z.literal("unknown").optional(),
  })
  .strict()
  .superRefine((video, ctx) => {
    if (video.provider === "netease") {
      if (!/^[A-Za-z0-9]{24,64}$/.test(video.id) ||
          video.watchUrl !== `https://yysls.fp.ps.netease.com/file/${video.id}.mp4` ||
          !video.playback || !video.visuallyInspected || !video.inspectionNote || !video.originalBytes || !video.reusePermission) {
        ctx.addIssue({code: z.ZodIssueCode.custom, message: "Official video requires matching provenance, inspection and bounded local playback"});
      }
      return;
    }
    if (video.playback) ctx.addIssue({code: z.ZodIssueCode.custom, message: "Local playback is only supported for verified official video"});
    const youtube = video.provider === "youtube";
    const validId = youtube
      ? /^[A-Za-z0-9_-]{11}$/.test(video.id)
      : /^BV[A-Za-z0-9]{10}$/.test(video.id);
    const expected = youtube
      ? `https://www.youtube.com/watch?v=${video.id}`
      : `https://www.bilibili.com/video/${video.id}`;
    if (!validId || video.watchUrl.replace(/\/$/, "") !== expected)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Video URL must match its provider and ID",
      });
  });
const cosmeticSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    nameOriginal: z.string().min(1),
    romanization: z.string().min(1),
    category: z.enum(["outfit", "hair", "weapon_skin", "effect", "accessory", "mount"]),
    secondaryCategories: z.array(z.enum(["outfit", "hair", "weapon_skin", "effect", "accessory", "mount"])).optional(),
    sourceId: z.string(),
    acquisitionServer: z.enum(["CN", "Global"]).optional(),
    mediaServer: z.enum(["CN", "Global"]).optional(),
    cnRelease: z
      .object({
        date: day.nullable(),
        precision: z.enum(["day", "unknown"]),
        timezone: z.null(),
        contextual: z.boolean(),
      })
      .passthrough()
      .refine(
        (x) => (x.date === null) === (x.precision === "unknown"),
        "Date precision must match its value",
      ),
    acquisition: acquisitionSchema,
    global: z.object({
      status: z.literal("unknown"),
      releaseDate: z.null(),
      officialName: z.null(),
    }),
    officialVideos: z.array(videoSchema),
    images: z
      .array(
        z
          .object({
            url: z.string().url(),
            width: z.number().positive(),
            height: z.number().positive(),
            reusePermission: z.string(),
          })
          .passthrough(),
      )
      ,
    mediaStatus: z.enum(["pending", "verified"]).optional(),
  })
  .passthrough();
export const forecastSchema = z
  .object({
    id: z.string().min(1),
    revision: z.number().int().positive(),
    cosmeticId: z.string(),
    state: z.enum(["active", "withdrawn", "superseded"]),
    precision: z.enum(["month", "window", "version"]),
    month: z.string().refine(isMonth).optional(),
    start: day.optional(),
    end: day.optional(),
    version: z.string().trim().min(1).optional(),
    evidenceLevel: z.enum(["limited", "supported"]),
    rationale: bilingual,
    assumptions: bilingual,
    reason: bilingual,
    sourceIds: z.array(z.string()).min(1),
    createdAt: z.string().datetime(),
    reviewDue: day,
  })
  .strict()
  .superRefine((f, ctx) => {
    const bad = (message) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    if (f.precision === "month" && (!f.month || f.start || f.end || f.version))
      bad("Month forecasts must retain month precision");
    if (
      f.precision === "window" &&
      (!f.start || !f.end || f.start > f.end || f.month || f.version)
    )
      bad("A window needs ordered start/end dates only");
    if (
      f.precision === "version" &&
      (!f.version || f.month || f.start || f.end)
    )
      bad("Version estimates must not acquire invented dates");
    if (f.reviewDue < f.createdAt.slice(0, 10))
      bad("Review due date precedes creation");
  });
const eventSchema = z
  .object({
    id: z.string().min(1),
    cosmeticId: z.string(),
    date: day,
    precision: z.literal("day"),
    server: z.literal("Global"),
    kind: z.enum(["release", "rerun"]),
    sourceIds: z.array(z.string()).min(1),
    status: z.enum(["announced", "released", "cancelled"]),
    scope: bilingual,
  })
  .strict();
const unique = (values, label) => {
  if (new Set(values).size !== values.length)
    throw new Error(`Duplicate ${label}`);
};
export function validateContent(research, media, forecastData, globalData) {
  const base = z
    .object({
      schemaVersion: z.literal(1),
      verifiedAt: day,
      sources: z.array(sourceSchema).min(1),
      cosmetics: z.array(cosmeticSchema).min(1),
    })
    .passthrough()
    .parse(research);
  const global = z
    .object({
      schemaVersion: z.literal(1),
      sources: z.array(sourceSchema),
      events: z.array(eventSchema),
    })
    .strict()
    .parse(globalData);
  const revisions = z
    .object({ schemaVersion: z.literal(1), reviewedAt: day.optional(), revisions: z.array(forecastSchema) })
    .strict()
    .parse(forecastData).revisions;
  const ids = base.cosmetics.map((c) => c.id);
  unique(ids, "cosmetic ID");
  const knownIds = new Set(ids);
  const allSources = [...base.sources, ...global.sources];
  unique(
    allSources.map((s) => s.id),
    "source ID",
  );
  const bySource = new Map(allSources.map((s) => [s.id, s]));
  function refs(item) {
    if (!knownIds.has(item.cosmeticId))
      throw new Error(`Unknown cosmetic ${item.cosmeticId}`);
    for (const id of item.sourceIds) {
      if (!bySource.has(id)) throw new Error(`Unknown source ${id}`);
    }
  }
  for (const c of base.cosmetics) {
    const primary = bySource.get(c.sourceId);
    if (!primary) throw new Error("Missing cosmetic source");
    if (c.cnRelease.date && primary.server !== "CN") throw new Error("CN facts require a CN source");
    if ((c.acquisitionServer ?? "CN") !== primary.server) throw new Error("Acquisition server must match its source");
    for (const video of c.officialVideos) {
      if (!bySource.has(video.sourceId))
        throw new Error(`Unknown video source ${video.sourceId}`);
    }
    if (c.mediaStatus !== "pending" && !media.some((m) => m.cosmeticId === c.id && m.index === 0))
      throw new Error(`Missing primary media ${c.id}`);
  }
  for (const e of global.events) {
    refs(e);
    if (!e.sourceIds.some((id) => bySource.get(id).server === "Global"))
      throw new Error("Global facts need global evidence");
  }
  unique(
    global.events.map((e) => e.id),
    "global event ID",
  );
  unique(
    revisions.map((f) => `${f.id}:${f.revision}`),
    "forecast revision",
  );
  const previous = new Map();
  for (const f of revisions) {
    refs(f);
    const last = previous.get(f.id);
    if (f.revision !== (last?.revision ?? 0) + 1)
      throw new Error(
        "Forecast revisions must be contiguous and append in order",
      );
    if (
      last &&
      (f.cosmeticId !== last.cosmeticId || f.createdAt <= last.createdAt)
    )
      throw new Error(
        "A revision must preserve cosmetic identity and advance time",
      );
    previous.set(f.id, f);
  }
  for (const m of media) {
    if (!knownIds.has(m.cosmeticId))
      throw new Error("Media has an unknown cosmetic");
    for (const key of ["thumbnail", "full", "preview", ...(m.display ? ["display"] : [])]) {
      if (!/^\/media\/[a-z0-9-]+\.webp$/.test(m[key]))
        throw new Error("Invalid media path");
    }
  }
  return {
    cosmetics: ids.length,
    images: media.length,
    forecasts: revisions.length,
    globalEvents: global.events.length,
  };
}
export function validateRegional(research, globalData, regionalData) {
  const schema = z.object({
    schemaVersion: z.literal(1), verifiedAt: day,
    records: z.array(z.object({
      cosmeticId: z.string(), server: z.enum(["CN", "Global"]),
      status: z.enum(["released", "announced"]), sourceIds: z.array(z.string()).min(1),
      verifiedAt: day, releaseDate: day.nullable(), precision: z.enum(["day", "unknown"]),
      scope: bilingual, identityBasis: bilingual, acquisition: acquisitionSchema.optional(),
      confirmationPending: z.boolean().optional(),
    }).strict().superRefine((r, ctx) => {
      if ((r.releaseDate === null) !== (r.precision === "unknown")) ctx.addIssue({code:z.ZodIssueCode.custom,message:"Regional date precision must match its value"});
      if (r.status === "released" && r.releaseDate && r.releaseDate > r.verifiedAt) ctx.addIssue({code:z.ZodIssueCode.custom,message:"Future listing cannot be released"});
      if (r.confirmationPending && r.status !== "announced") ctx.addIssue({code:z.ZodIssueCode.custom,message:"Pending confirmation must remain an announcement"});
    })),
  }).strict();
  const data = schema.parse(regionalData);
  const ids = new Set(research.cosmetics.map(c => c.id));
  const sources = new Map([...research.sources, ...globalData.sources].map(s => [s.id,s]));
  unique(data.records.map(r => `${r.cosmeticId}:${r.server}`), "regional record");
  for (const r of data.records) {
    if (!ids.has(r.cosmeticId)) throw new Error("Unknown regional cosmetic");
    if (r.sourceIds.some(id => !sources.has(id))) throw new Error("Unknown regional source");
    if (!r.sourceIds.some(id => sources.get(id).server === r.server)) throw new Error("Regional status needs evidence from that server");
    if (!r.sourceIds.some(id => sources.get(id).server === r.server && sources.get(id).kind !== "community")) throw new Error("Community wiki cannot independently establish regional release status");
    if (r.verifiedAt > data.verifiedAt) throw new Error("Record review cannot follow the batch review");
  }
  return { regionalRecords: data.records.length };
}

export function validateEditorial(
  research,
  globalData,
  localizations,
  updates,
) {
  const names = z
    .record(
      z
        .object({ koName: z.string().trim().min(1), description: bilingual })
        .strict(),
    )
    .parse(localizations);
  const entries = z
    .object({
      schemaVersion: z.literal(1),
      entries: z.array(
        z
          .object({
            id: z.string().min(1),
            date: day,
            kind: bilingual,
            title: bilingual,
            body: bilingual,
            sourceIds: z.array(z.string()).min(1),
          })
          .strict(),
      ),
    })
    .strict()
    .parse(updates).entries;
  const ids = new Set(research.cosmetics.map((c) => c.id));
  if (
    Object.keys(names).length !== ids.size ||
    Object.keys(names).some((id) => !ids.has(id))
  )
    throw new Error("Every cosmetic needs exactly one localization");
  const sources = new Set(
    [...research.sources, ...globalData.sources].map((s) => s.id),
  );
  unique(
    entries.map((e) => e.id),
    "update ID",
  );
  for (const entry of entries)
    for (const id of entry.sourceIds)
      if (!sources.has(id)) throw new Error(`Unknown update source ${id}`);
  return { localizations: Object.keys(names).length, updates: entries.length };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log(validateWiki(JSON.parse(fs.readFileSync(path.join(root, "content/research.json"), "utf8")), readWiki()));
  const read = (name) =>
    JSON.parse(fs.readFileSync(path.join(root, "content", name), "utf8"));
  const media = read("media.json");
  console.log(validateRegional(read("research.json"), read("global-events.json"), read("regional-records.json")));
  console.log(
    validateContent(
      read("research.json"),
      media,
      read("forecasts.json"),
      read("global-events.json"),
    ),
  );
  console.log(
    validateEditorial(
      read("research.json"),
      read("global-events.json"),
      read("localizations.json"),
      read("updates.json"),
    ),
  );
  for (const m of media)
    for (const key of ["thumbnail", "full", "preview", ...(m.display ? ["display"] : [])]) {
      const stat = fs.statSync(path.join(root, "public", m[key]));
      if (stat.size !== m[key + "Bytes"])
        throw new Error(`Media size mismatch: ${m[key]}`);
    }
  for (const c of read("research.json").cosmetics)
    for (const v of c.officialVideos) {
      if (!v.playback) continue;
      if (fs.statSync(path.join(root, "public", v.playback.src)).size !== v.playback.bytes)
        throw new Error(`Video size mismatch: ${v.playback.src}`);
      if (!fs.existsSync(path.join(root, "public", v.playback.poster)))
        throw new Error(`Missing video poster: ${v.playback.poster}`);
    }
  console.log(
    "Content, references, bilingual copy, dates, and media files validated.",
  );
}

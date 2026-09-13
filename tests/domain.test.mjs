import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  cleanWatchlist,
  forecastDue,
  forecastEnded,
  forecastInMonth,
  isDay,
  isMonth,
  latestRevisions,
  monthGrid,
  shiftMonth,
} from "../lib/roadmap-domain.mjs";
import {
  forecastSchema,
  validateEditorial,
  videoSchema,
  validateContent,
} from "../scripts/validate-content.mjs";
const read = (name) =>
  JSON.parse(
    fs.readFileSync(new URL(`../content/${name}`, import.meta.url), "utf8"),
  );
const research = read("research.json"),
  media = read("media.json");
// Synthetic forecast fixtures exercise semantics; they never enter published content.
const fixture = {
  id: "test-only",
  revision: 1,
  cosmeticId: research.cosmetics[0].id,
  state: "active",
  precision: "month",
  month: "2026-09",
  evidenceLevel: "limited",
  rationale: { en: "Synthetic rationale", ko: "검증용 근거" },
  assumptions: { en: "Synthetic assumption", ko: "검증용 가정" },
  reason: { en: "Synthetic revision", ko: "검증용 변경" },
  sourceIds: [research.sources[0].id],
  createdAt: "2026-08-01T00:00:00Z",
  reviewDue: "2026-08-20",
};
test("reject impossible and ambiguous dates", () => {
  assert.ok(isDay("2024-02-29"));
  for (const x of [
    "2025-02-29",
    "2026-09-31",
    "2026-1-01",
    "2026-01-01T00:00:00Z",
    null,
  ])
    assert.equal(isDay(x), false);
  assert.equal(isMonth("2026-13"), false);
});
test("month navigation crosses years without local timezone conversion", () => {
  assert.equal(shiftMonth("2025-12", 1), "2026-01");
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  const days = monthGrid("2024-02").filter(Boolean);
  assert.equal(days.length, 29);
  assert.equal(days[0], "2024-02-01");
  assert.equal(days.at(-1), "2024-02-29");
});
test("month and version precision cannot turn into fake day dates", () => {
  assert.ok(forecastSchema.safeParse(fixture).success);
  assert.equal(
    forecastSchema.safeParse({ ...fixture, start: "2026-09-01" }).success,
    false,
  );
  const v = {
    ...fixture,
    precision: "version",
    month: undefined,
    version: "Future version",
  };
  assert.ok(forecastSchema.safeParse(v).success);
  assert.equal(forecastInMonth(v, "2026-09"), false);
  assert.equal(forecastEnded(v, "2027-01-01"), false);
});
test("window overlap includes boundary months but not adjacent months", () => {
  const f = {
    ...fixture,
    precision: "window",
    month: undefined,
    start: "2026-09-25",
    end: "2026-10-05",
  };
  assert.ok(forecastSchema.safeParse(f).success);
  assert.equal(forecastInMonth(f, "2026-09"), true);
  assert.equal(forecastInMonth(f, "2026-10"), true);
  assert.equal(forecastInMonth(f, "2026-11"), false);
  assert.equal(
    forecastSchema.safeParse({ ...f, end: "2026-09-24" }).success,
    false,
  );
});
test("overdue and elapsed estimates do not become released facts", () => {
  assert.equal(forecastDue(fixture, "2026-09-13"), true);
  assert.equal(forecastEnded(fixture, "2026-09-30"), false);
  assert.equal(forecastEnded(fixture, "2026-10-01"), true);
  assert.equal(fixture.state, "active");
});
test("latest revisions preserve older forecasts and respect withdrawals", () => {
  const later = { ...fixture, revision: 2, state: "withdrawn" };
  const history = [fixture, later];
  assert.deepEqual(latestRevisions(history), [later]);
  assert.equal(history.length, 2);
  assert.equal(history[0].state, "active");
});
test("watchlist rejects corrupted, unknown, and duplicate entries", () => {
  assert.deepEqual(cleanWatchlist(["a", "a", "unknown", 4, null], ["a", "b"]), [
    "a",
  ]);
  assert.deepEqual(cleanWatchlist({ a: true }, ["a"]), []);
});
test("published content validates with explicit evidence and precision", () => {
  const stats = validateContent(
    research,
    media,
    read("forecasts.json"),
    read("global-events.json"),
  );
  assert.ok(stats.cosmetics > 0);
  assert.equal(stats.forecasts, read("forecasts.json").revisions.length);
});
test("a CN source cannot establish a global fact", () => {
  const events = {
    schemaVersion: 1,
    sources: [],
    events: [
      {
        id: "test-global",
        cosmeticId: fixture.cosmeticId,
        date: "2026-09-20",
        precision: "day",
        server: "Global",
        kind: "release",
        sourceIds: fixture.sourceIds,
        status: "announced",
        scope: { en: "Test", ko: "테스트" },
      },
    ],
  };
  assert.throws(
    () =>
      validateContent(
        research,
        media,
        { schemaVersion: 1, revisions: [] },
        events,
      ),
    /global evidence/,
  );
});
test("revisions cannot be overwritten by duplicate revision IDs", () => {
  assert.throws(
    () =>
      validateContent(
        research,
        media,
        { schemaVersion: 1, revisions: [fixture, fixture] },
        read("global-events.json"),
      ),
    /Duplicate forecast revision/,
  );
});

test("editorial copy must cover every cosmetic and reference known sources", () => {
  const localizations = read("localizations.json"),
    updates = read("updates.json"),
    global = read("global-events.json");
  assert.equal(
    validateEditorial(research, global, localizations, updates).localizations,
    research.cosmetics.length,
  );
  delete localizations[research.cosmetics[0].id];
  assert.throws(
    () => validateEditorial(research, global, localizations, updates),
    /localization/,
  );
  updates.entries[0].sourceIds = ["missing-source"];
  assert.throws(
    () =>
      validateEditorial(research, global, read("localizations.json"), updates),
    /Unknown update source/,
  );
});
test("video metadata cannot point a trusted provider at another host", () => {
  const video = {
    provider: "youtube",
    id: "abcdefghijk",
    watchUrl: "https://www.youtube.com/watch?v=abcdefghijk",
    title: { en: "Test footage", ko: "테스트 영상" },
    sourceId: "test-source",
  };
  assert.equal(videoSchema.safeParse(video).success, true);
  assert.equal(
    videoSchema.safeParse({
      ...video,
      watchUrl: "https://untrusted.example/watch?v=abcdefghijk",
    }).success,
    false,
  );
  assert.equal(
    videoSchema.safeParse({ ...video, id: "../../escape" }).success,
    false,
  );
});

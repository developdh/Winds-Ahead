import { readFileSync } from "node:fs";

// Keep the complete research and asset audit in Git. Only these build-time
// omissions are unused by the visitor interface; source excerpts stay visible.
const omit = (value, keys) => Object.fromEntries(
  Object.entries(value).filter(([key]) => !keys.includes(key)),
);
const sourceFields = ["id", "url", "publisher", "server", "titleOriginal", "displayedPublicationDate", "evidenceTier", "kind"];
const source = value => Object.fromEntries(sourceFields.filter(key => Object.hasOwn(value, key)).map(key => [key, value[key]]));
const imageAudit = ["inspectionNote", "description", "kind", "bytes", "localCopy", "visuallyInspected", "sourceId", "sourceCrop", "sourceFrame", "filePage", "sourceFrameSeconds", "representativeFrameZeroBased", "thumbnailSourceCrop", "sourceTimestampSeconds", "frameAtSeconds"];
const cosmeticAudit = ["global", "identityEvidence", "cnEnd", "imagePublisher", "weaponTypeOriginal", "mediaStatus"];
const mediaFields = ["cosmeticId", "index", "originalUrl", "thumbnail", "full", "preview", "display", "displayWidth", "displayHeight", "presentationSubject"];

export function projectVisitorData(name, data) {
  if (name === "research") return {
    schemaVersion: data.schemaVersion,
    verifiedAt: data.verifiedAt,
    sources: data.sources.map(source),
    cosmetics: data.cosmetics.map(c => ({
      ...omit(c, cosmeticAudit),
      cnRelease: omit(c.cnRelease, ["basis"]),
      images: c.images.map(image => omit(image, imageAudit)),
    })),
  };
  if (name === "media") return data.map(image => Object.fromEntries(
    mediaFields.filter(key => Object.hasOwn(image, key)).map(key => [key, image[key]]),
  ));
  if (name === "global-events") return { ...data, sources: data.sources.map(source) };
  return data;
}

export function visitorData() {
  return {
    name: "winds-ahead-visitor-data",
    // Replace Vite's JSON output, keeping the default import's value unchanged.
    enforce: "post",
    transform(_code, id) {
      const match = id.replaceAll("\\", "/").match(/\/content\/(research|media|global-events)\.json$/);
      if (!match) return null;
      const data = projectVisitorData(match[1], JSON.parse(readFileSync(id, "utf8")));
      return { code: serializeVisitorData(data), map: null };
    },
  };
}

// Long repeated values share storage; dates, names and all other values decode
// to the same plain objects without a runtime parser, fetch or compression API.
export function serializeVisitorData(data) {
  const counts = new Map();
  function count(value) {
    if (typeof value === "string") counts.set(value, (counts.get(value) ?? 0) + 1);
    else if (value && typeof value === "object") Object.values(value).forEach(count);
  }
  count(data);
  const strings = [...counts].filter(([value, uses]) =>
    uses > 1 && Buffer.byteLength(JSON.stringify(value)) * (uses - 1) > 12 * uses,
  ).map(([value]) => value);
  const indices = new Map(strings.map((value, index) => [value, index]));
  function expression(value) {
    if (typeof value === "string" && indices.has(value)) return `text[${indices.get(value)}]`;
    if (Array.isArray(value)) return `[${value.map(expression).join(",")}]`;
    if (value && typeof value === "object") return `{${Object.entries(value)
      .map(([key, child]) => `${JSON.stringify(key)}:${expression(child)}`).join(",")}}`;
    return JSON.stringify(value);
  }
  return `const text=${JSON.stringify(strings)};export default ${expression(data)};`;
}

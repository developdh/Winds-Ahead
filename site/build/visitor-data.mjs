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
      const match = id.replaceAll("\\", "/").match(/\/content\/(research|media|global-events|regional-records|localizations|deadlines|updates|terminology|magazine|magazine-export-metrics)\.json$/);
      if (!match) return null;
      const data = projectVisitorData(match[1], JSON.parse(readFileSync(id, "utf8")));
      return { code: serializeVisitorData(data), map: null };
    },
  };
}

// Repeated strings share storage; repeated ordered field lists use small
// constructors. Every call still creates a fresh object, without a runtime
// parser, fetch or compression API. Cap helpers and parameters to keep the
// generated module and browser call sites bounded as content grows.
export function serializeVisitorData(data) {
  const counts = new Map();
  const shapes = new Map();
  const maxShapes = 128;
  const maxShapeFields = 64;
  // A bare __proto__ property changes an object literal's prototype instead of
  // defining the own data property that JSON.parse produces.
  const property = key => key === "__proto__" ? `[${JSON.stringify(key)}]` : JSON.stringify(key);
  function count(value) {
    if (typeof value === "string") counts.set(value, (counts.get(value) ?? 0) + 1);
    else if (value && typeof value === "object") {
      if (!Array.isArray(value)) {
        const keys = Object.keys(value);
        if (keys.length && keys.length <= maxShapeFields) {
          const signature = JSON.stringify(keys);
          const shape = shapes.get(signature);
          if (shape) shape.uses++;
          else shapes.set(signature, {
            keys,
            uses: 1,
            keyBytes: keys.reduce((total, key) => total + Buffer.byteLength(property(key)) + 1, 0),
          });
        }
      }
      Object.values(value).forEach(count);
    }
  }
  count(data);
  const strings = [...counts].filter(([value, uses]) =>
    uses > 1 && Buffer.byteLength(JSON.stringify(value)) * (uses - 1) > 12 * uses,
  ).map(([value]) => value);
  const indices = new Map(strings.map((value, index) => [value, index]));
  const definition = (shape, name) => {
    const parameters = shape.keys.map((_, index) => `v${index}`);
    return `const ${name}=(${parameters.join(",")})=>({${shape.keys
      .map((key, index) => `${property(key)}:${parameters[index]}`).join(",")}});`;
  };
  // Child expressions are identical in literals and constructor arguments, so
  // this measures the exact UTF-8 savings, including every declaration/call.
  const savings = (shape, name) => shape.uses * (shape.keyBytes - Buffer.byteLength(name))
    - Buffer.byteLength(definition(shape, name));
  const constructors = new Map();
  const declarations = [];
  const candidates = [...shapes].filter(([, shape]) => shape.uses > 1)
    .sort((a, b) => savings(b[1], "s0") - savings(a[1], "s0"));
  for (const [signature, shape] of candidates) {
    if (declarations.length === maxShapes) break;
    const name = `s${declarations.length}`;
    if (savings(shape, name) <= 0) continue;
    constructors.set(signature, name);
    declarations.push(definition(shape, name));
  }
  function expression(value) {
    if (typeof value === "string" && indices.has(value)) return `text[${indices.get(value)}]`;
    if (Array.isArray(value)) return `[${value.map(expression).join(",")}]`;
    if (value && typeof value === "object") {
      const entries = Object.entries(value);
      const constructor = constructors.get(JSON.stringify(entries.map(([key]) => key)));
      if (constructor) return `${constructor}(${entries.map(([, child]) => expression(child)).join(",")})`;
      return `{${entries.map(([key, child]) => `${property(key)}:${expression(child)}`).join(",")}}`;
    }
    if (Object.is(value, -0)) return "-0";
    return JSON.stringify(value);
  }
  return `const text=${JSON.stringify(strings)};${declarations.join("")}export default ${expression(data)};`;
}

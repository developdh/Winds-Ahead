import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";
const bilingual = z.object({ en: z.string().trim().min(1), ko: z.string().trim().min(1) });
const wikiUrl = z.string().url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" && url.hostname === "yy16s.huijiwiki.com" && url.pathname.startsWith("/wiki/") && !decodeURIComponent(url.pathname).includes("页面不存在");
}, "Expected a real Huiji article URL");
const points = z.number().int().nonnegative().nullable();
export const wikiSchema = z.object({
  schemaVersion: z.literal(1), cosmeticId: z.string().regex(/^[a-z0-9-]+$/),
  titleOriginal: z.string().min(1), sourceUrl: wikiUrl, revisionUrl: wikiUrl.nullable(),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), license: z.literal("CC BY-NC-SA 3.0"),
  articleAvailable: z.boolean(), category: z.enum(["sets", "weapon", "effect", "mount"]),
  grade: bilingual.nullable(), styleScore: points,
  flags: z.object({ dye: z.boolean().nullable(), tailoring: z.boolean().nullable(), gifting: z.boolean().nullable(), trading: z.boolean().nullable() }).strict(),
  components: z.array(z.object({nameOriginal:z.string().min(1),label:bilingual,styleScore:points,sourceUrl:wikiUrl.nullable()}).strict()),
  reportedComponentCount: points,
  collectionReward: z.object({amount:z.number().int().positive(),currencyOriginal:z.literal("长鸣玉"),currency:bilingual}).strict().nullable(),
  resultsAnimation: z.object({available:z.literal(true),styleScore:points}).strict().nullable(),
  acquisition: bilingual.extend({original:z.string().min(1)}).nullable(),
  timing: bilingual.extend({original:z.string().min(1),timezone:z.null()}).nullable(),
}).passthrough();
export function validateWiki(research, documents) {
  const expected = research.cosmetics.filter(c => c.wikiDetails);
  if (expected.length !== documents.length) throw new Error("Every wiki-linked cosmetic needs one detail document");
  const found = new Set();
  for (const document of documents) {
    const d = wikiSchema.parse(document);
    if (found.has(d.cosmeticId)) throw new Error("Duplicate wiki detail");
    found.add(d.cosmeticId);
    const cosmetic = expected.find(c => c.id === d.cosmeticId);
    if (!cosmetic) throw new Error("Unknown wiki cosmetic");
    if ({sets:'outfit',weapon:'weapon_skin',effect:'effect',mount:'mount'}[d.category] !== cosmetic.category) throw new Error("Wiki composition cannot cross cosmetic categories");
    if (!d.articleAvailable && (d.components.length || d.styleScore !== null || d.collectionReward || d.revisionUrl)) throw new Error("Missing wiki articles cannot acquire detail facts");
    if (cosmetic.wikiOnly) {
      const source = research.sources.find(s => s.id === cosmetic.sourceId);
      if (source?.kind !== "community" || source.evidenceTier !== "C") throw new Error("Wiki-only records need community attribution");
      if (cosmetic.cnRelease.date !== null || cosmetic.global.status !== "unknown" || cosmetic.officialNameEn !== null || cosmetic.officialNameKo !== null) throw new Error("Wiki cannot establish official dates or names");
      if (cosmetic.acquisition.amount !== null || cosmetic.acquisition.pricing !== "unknown") throw new Error("Wiki scores and rewards cannot become acquisition prices");
    }
  }
  return {wikiReferences:found.size, detailedArticles:documents.filter(d=>d.articleAvailable).length,components:documents.reduce((n,d)=>n+d.components.length,0)};
}
export function readWiki() {
  const folder = new URL("../public/data/wiki/", import.meta.url);
  return fs.readdirSync(folder).filter(file=>file.endsWith(".json")).map(file=>{
    const value=JSON.parse(fs.readFileSync(new URL(file,folder),"utf8"));
    if (file!==`${value.cosmeticId}.json`) throw new Error("Wiki document filename must match cosmetic ID");
    return value;
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(validateWiki(JSON.parse(fs.readFileSync(new URL("../content/research.json",import.meta.url),"utf8")),readWiki()));

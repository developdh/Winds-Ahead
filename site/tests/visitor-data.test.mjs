import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { projectVisitorData, serializeVisitorData, visitorData } from '../build/visitor-data.mjs';
import { preferredMedia } from '../lib/media-domain.mjs';
import { selectAcquisition } from '../lib/acquisition-domain.mjs';

const read = async name => JSON.parse(await fs.readFile(new URL(`../content/${name}.json`, import.meta.url), 'utf8'));
const [research, media, globalEvents, regional] = await Promise.all(
  ['research', 'media', 'global-events', 'regional-records'].map(read),
);

// This contract follows the visitor consumers, independently of the build's
// omission list: catalog/search, details, source disclosures, gallery and video.
const cosmeticFields = [
  'id', 'nameOriginal', 'romanization', 'category', 'secondaryCategories',
  'sourceId', 'wikiOnly', 'wikiDetails', 'acquisitionServer', 'mediaServer',
  'mediaKind', 'officialNameEn', 'officialNameKo', 'searchAliases', 'namingNote',
  'appearanceDetails', 'sourceEvidence', 'imageSourceUrl', 'acquisition',
  'officialVideos',
];
const imageFields = [
  'url', 'server', 'width', 'height', 'alt', 'caption', 'sourceKind',
  'sourceUrl', 'sourceLabel', 'contributor', 'attribution', 'reusePermission',
];
const sourceFields = [
  'id', 'url', 'titleOriginal', 'publisher', 'server', 'displayedPublicationDate',
  'evidenceTier', 'kind',
];
const mediaFields = [
  'cosmeticId', 'index', 'originalUrl', 'thumbnail', 'full', 'preview',
  'display', 'displayWidth', 'displayHeight', 'presentationSubject',
];
const assertFields = (actual, expected, fields, label) => {
  for (const field of fields) assert.deepEqual(actual[field], expected[field], `${label}.${field}`);
};
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const projection = {
  research: projectVisitorData('research', research),
  media: projectVisitorData('media', media),
  globalEvents: projectVisitorData('global-events', globalEvents),
};

test('visitor projection preserves every catalog, detail, evidence and video value', () => {
  assert.equal(projection.research.verifiedAt, research.verifiedAt);
  assert.deepEqual(projection.research.cosmetics.map(c => c.id), research.cosmetics.map(c => c.id));
  for (let i = 0; i < research.cosmetics.length; i++) {
    const original = research.cosmetics[i], projected = projection.research.cosmetics[i];
    assertFields(projected, original, cosmeticFields, original.id);
    assertFields(projected.cnRelease, original.cnRelease, ['date', 'precision', 'contextual'], `${original.id}.cnRelease`);
    assert.equal(projected.images.length, original.images.length, `${original.id}.images`);
    for (let j = 0; j < original.images.length; j++) {
      assertFields(projected.images[j], original.images[j], imageFields, `${original.id}.images[${j}]`);
    }
  }
  // Guard against a vacuous contract if a fixture is accidentally narrowed.
  assert.ok(research.cosmetics.some(c => c.acquisition.sourceExcerpt), 'Original acquisition wording is exercised');
  assert.ok(research.cosmetics.some(c => c.officialVideos.some(v => v.playback)), 'Native video metadata is exercised');
  assert.ok(research.cosmetics.some(c => c.appearanceDetails), 'Community appearance facts are exercised');
  assert.ok(research.cosmetics.some(c => c.images.some(image => image.sourceKind === 'community')), 'Community image credits are exercised');
});

test('source disclosures and all scheduled event facts survive both source registries', () => {
  for (const [originals, projected] of [
    [research.sources, projection.research.sources],
    [globalEvents.sources, projection.globalEvents.sources],
  ]) {
    assert.deepEqual(projected.map(source => source.id), originals.map(source => source.id));
    originals.forEach((original, index) => assertFields(projected[index], original, sourceFields, original.id));
  }
  assert.deepEqual(
    { ...projection.globalEvents, sources: [] },
    { ...globalEvents, sources: [] },
    'Release dates, statuses, scopes and event source IDs remain unchanged',
  );
});

test('gallery paths, source indices and female-first ordering are unchanged', () => {
  assert.equal(projection.media.length, media.length);
  media.forEach((original, index) => assertFields(projection.media[index], original, mediaFields, `${original.cosmeticId}:${original.index}`));
  for (const cosmetic of research.cosmetics) {
    const original = preferredMedia(media, cosmetic.id);
    const projected = preferredMedia(projection.media, cosmetic.id);
    assert.deepEqual(projected.map(image => image.index), original.map(image => image.index), cosmetic.id);
    projected.forEach(image => {
      const dimensions = projection.research.cosmetics.find(c => c.id === cosmetic.id).images[image.index];
      assert.equal(dimensions.url, image.originalUrl, `${cosmetic.id}: original image remains accessible`);
    });
  }
});

test('regional acquisition filtering keeps its prices, server choice and original wording', () => {
  const records = new Map(regional.records.map(record => [`${record.cosmeticId}:${record.server}`, record]));
  for (let i = 0; i < research.cosmetics.length; i++) {
    const original = research.cosmetics[i], projected = projection.research.cosmetics[i];
    const cn = records.get(`${original.id}:CN`), global = records.get(`${original.id}:Global`);
    for (const server of ['all', 'cn', 'global']) {
      for (const method of ['all', 'shop', 'resonance', 'sound-jade', 'battle-pass', 'gameplay', 'event', 'exchange', 'unknown']) {
        assert.deepEqual(
          selectAcquisition(projected, cn, global, server, method),
          selectAcquisition(original, cn, global, server, method),
          `${original.id}: ${server}/${method}`,
        );
      }
    }
  }
});

test('projection does not mutate canonical JSON or affect unrelated imports', () => {
  for (const [name, original] of [['research', research], ['media', media], ['global-events', globalEvents]]) {
    const input = structuredClone(original), before = JSON.stringify(input);
    projectVisitorData(name, freeze(input));
    assert.equal(JSON.stringify(input), before, name);
  }
  const unrelated = freeze({ text: 'Canonical content stays intact.' });
  assert.deepEqual(projectVisitorData('unrelated', unrelated), unrelated);
  const plugin = visitorData();
  for (const id of ['/example/content/other.json', '/example/content/research.json?raw', '/example/other/research.json']) {
    assert.equal(plugin.transform('untouched', id), null, id);
  }
});

test('emitted JavaScript reconstructs all projected visitor data exactly', async () => {
  const repeated = '한글과 燕雲鏡, quotes " and apostrophes \' plus ` and ${text}; line\nbreak\u2028separator';
  const expected = {
    ...projection,
    escaping: { first: repeated, second: repeated, values: [null, false, true, 0, 1.25, '', repeated] },
  };
  const code = serializeVisitorData(expected);
  const module = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  assert.deepEqual(module.default, expected, 'String sharing must preserve values, arrays, unknowns and multilingual source text');
  assert.ok(Buffer.byteLength(code) < Buffer.byteLength(`export default ${JSON.stringify(expected)};`), 'Sharing repeated text must reduce the emitted module');
});

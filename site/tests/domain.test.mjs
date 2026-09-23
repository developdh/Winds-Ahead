import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { readWiki, validateWiki, wikiSchema } from "../scripts/validate-wiki.mjs";
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
  acquisitionSchema,
  forecastSchema,
  validateEditorial,
  validateRegional,
  videoSchema,
  validateContent,
} from "../scripts/validate-content.mjs";
const read = (name) =>
  JSON.parse(
    fs.readFileSync(new URL(`../content/${name}`, import.meta.url), "utf8"),
  );
const research = read("research.json"),
  media = read("media.json");
test("wiki facts preserve unknown flags, source attribution and one document per cosmetic", () => {
  const wiki = readWiki();
  assert.equal(validateWiki(research, wiki).wikiReferences, research.cosmetics.filter(c=>c.wikiDetails).length);
  assert.throws(()=>validateWiki(research,wiki.slice(1)),/one detail document/);
  const d=wiki.find(x=>x.cosmeticId==='zui-penglai');
  assert.equal(d.styleScore,875);
  assert.equal(d.collectionReward.amount,100);
  assert.equal(d.collectionReward.currencyOriginal,'长鸣玉');
  assert.equal(d.components.length,6);
  assert.equal(wikiSchema.safeParse({...d,flags:{...d.flags,dye:'unknown'}}).success,false);
  assert.equal(wikiSchema.safeParse({...d,sourceUrl:'https://example.com/fake'}).success,false);
});
test("community scores cannot become official prices or release records", () => {
  const wiki=readWiki(), altered=structuredClone(research), item=altered.cosmetics.find(c=>c.wikiOnly);
  item.acquisition.amount=875; item.acquisition.pricing='fixed';
  assert.throws(()=>validateWiki(altered,wiki),/acquisition prices/);
  item.acquisition.amount=null; item.acquisition.pricing='unknown'; item.cnRelease.date='2026-09-13';
  assert.throws(()=>validateWiki(altered,wiki),/official dates/);
  const missing=wiki.find(d=>!d.articleAvailable);
  assert.throws(()=>validateWiki(research,wiki.map(d=>d===missing?{...d,styleScore:2000}:d)),/Missing wiki articles/);
  const original=research.cosmetics.find(c=>c.wikiOnly);
  assert.throws(()=>validateRegional(research,read('global-events.json'),{schemaVersion:1,verifiedAt:'2026-09-13',records:[{cosmeticId:original.id,server:'CN',status:'released',sourceIds:[original.sourceId],verifiedAt:'2026-09-13',releaseDate:null,precision:'unknown',scope:{en:'Test',ko:'테스트'},identityBasis:{en:'Test',ko:'테스트'}}]}),/Community wiki/);
});
test("series prefixes do not duplicate weapons or attach outfit composition to a hairstyle", () => {
  const wiki=readWiki();
  assert.equal(wiki.find(d=>d.titleOriginal==='赋神·鱼龙空游').cosmeticId,'yu-long-kongyou');
  assert.equal(research.cosmetics.some(c=>c.id==='wiki-fu-shen-yu-long-kongyou'),false);
  assert.equal(research.cosmetics.find(c=>c.id==='shuang-han-tian-quan').wikiDetails,undefined);
  assert.equal(research.cosmetics.find(c=>c.id==='wiki-shuang-han-tian-quan').category,'outfit');
  for (const id of ['qiu-hong-ta-zhi','han-lu-jing-cui','fan-yue-xing-chuan','cheng-fu-gui-meng','yu-long-kongyou','qing-niao-xian-dao']) {
    const acquisition=research.cosmetics.find(c=>c.id===id).acquisition;
    assert.equal(acquisition.pricing,'fixed');
    assert.equal(acquisition.amount,2);
    assert.equal(acquisition.currencyOriginal,'音玉');
  }
});
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

test('official effects require inspected provenance and a bounded local video', () => {
  const v = research.cosmetics.flatMap(c => c.officialVideos).find(v => v.provider === 'netease');
  assert.ok(v);
  assert.ok(videoSchema.safeParse(v).success);
  for (const bad of [
    {...v, playback: undefined},
    {...v, visuallyInspected: undefined},
    {...v, watchUrl: 'https://untrusted.example/file/'+v.id+'.mp4'},
    {...v, playback: {...v.playback, bytes: 102489850}},
    {...v, playback: {...v.playback, src: v.watchUrl}},
    {...v, playback: {...v.playback, src: '/media/videos/../escape.mp4'}},
  ]) assert.equal(videoSchema.safeParse(bad).success, false);
});

test('fixed acquisition costs require a real quantity, currency and location', () => {
  const a = research.cosmetics.find(c => c.id === 'jumang').acquisition;
  assert.ok(acquisitionSchema.safeParse(a).success);
  for (const bad of [{...a, amount: null}, {...a, amount: 0}, {...a, amount: -1}, {...a, currencyOriginal: null}, {...a, currencyOriginal: 'unknown'}, {...a, location: {...a.location, ko: ''}}])
    assert.equal(acquisitionSchema.safeParse(bad).success, false);
});
test('draws and paid passes do not acquire invented fixed cosmetic prices', () => {
  for (const id of ['zui-penglai', 'zongheng', 'yunzhong-jinshu']) {
    const a=research.cosmetics.find(c=>c.id===id).acquisition;
    assert.ok(acquisitionSchema.safeParse(a).success);
    assert.equal(acquisitionSchema.safeParse({...a, amount: 1}).success, false);
    assert.equal(acquisitionSchema.safeParse({...a, pricing: 'fixed', amount: 1}).success, false);
  }
});
test('a confirmed draw can retain an unknown currency with explicit source context', () => {
  const a=read('regional-records.json').records.find(r=>r.cosmeticId==='wu-sheng-gu' && r.server==='Global').acquisition;
  assert.equal(a.kind,'limited_draw');
  assert.equal(a.currencyOriginal,null);
  assert.ok(acquisitionSchema.safeParse(a).success);
  assert.equal(acquisitionMethod(a),'resonance');
  assert.equal(acquisitionSchema.safeParse({...a,conditions:null}).success,false);
  assert.equal(acquisitionSchema.safeParse({...a,amount:1}).success,false);
});
test('limited discounts retain a larger regular price', () => {
  const a = research.cosmetics.find(c => c.id === 'xuanying-lianchen-buran').acquisition;
  assert.equal(a.amount, 2); assert.equal(a.regularAmount, 3);
  assert.ok(acquisitionSchema.safeParse(a).success);
  for (const regularAmount of [1, 2]) assert.equal(acquisitionSchema.safeParse({...a, regularAmount}).success, false);
});

test('unpriced exchanges and milestones preserve unknown costs without becoming free or fixed', () => {
  const base = research.cosmetics.find(c => c.id === 'jumang').acquisition;
  const exchange = {...base, pricing: 'unknown', amount: null, regularAmount: null,
    conditions: {en: 'Exchange quantity not stated in the source.', ko: '공지에 교환 수량 미표기.'}};
  const milestone = {...exchange, kind: 'milestone', currencyOriginal: null};
  for (const a of [exchange, milestone]) {
    assert.ok(acquisitionSchema.safeParse(a).success);
    for (const bad of [{...a, amount: 0}, {...a, amount: 1}, {...a, regularAmount: 2}, {...a, conditions: null}])
      assert.equal(acquisitionSchema.safeParse(bad).success, false);
  }
  assert.equal(acquisitionSchema.safeParse({...milestone, pricing: 'fixed', amount: 1, currencyOriginal: '八音窍'}).success, false);
  assert.equal(acquisitionSchema.safeParse({...exchange, kind: 'limited_draw'}).success, false);
});


test("regional release evidence cannot cross servers or manufacture dates", () => {
  const record = { cosmeticId: research.cosmetics[0].id, server: "CN", status: "released", sourceIds: [research.sources[0].id], verifiedAt: "2026-09-13", releaseDate: null, precision: "unknown", scope: {en:"Test",ko:"테스트"}, identityBasis: {en:"Test",ko:"테스트"} };
  const data = {schemaVersion:1,verifiedAt:"2026-09-13",records:[record]};
  assert.equal(validateRegional(research, read("global-events.json"), data).regionalRecords, 1);
  assert.throws(() => validateRegional(research, read("global-events.json"), {...data, records:[{...record,server:"Global"}]}), /that server/);
  assert.throws(() => validateRegional(research, read("global-events.json"), {...data, records:[{...record,releaseDate:"2026-09-16",precision:"day"}]}), /Future listing/);
  assert.throws(() => validateRegional(research, read("global-events.json"), {...data, records:[record,record]}), /Duplicate regional/);
});

test("free rewards need a documented reward method rather than an unknown price", () => {
  const base = {en:"Reward",ko:"보상",kind:"event",pricing:"free",amount:null,regularAmount:null,currencyOriginal:null,location:{en:"Event",ko:"이벤트",original:"Event"},conditions:{en:"Earned by participation",ko:"참여 보상"}};
  assert.ok(acquisitionSchema.safeParse(base).success);
  assert.equal(acquisitionSchema.safeParse({...base,conditions:null}).success,false);
  assert.equal(acquisitionSchema.safeParse({...base,kind:"shop"}).success,false);
  assert.equal(acquisitionSchema.safeParse({...base,amount:0}).success,false);
});

// Archive ordering and countdown fixtures never become published schedules.
import { daysUntil, globalOutlook, sortArchive, validSort, validServer } from '../lib/archive-domain.mjs';
import { releaseState, matchesReleaseFilter } from '../lib/regional-domain.mjs';
import { acquisitionMethod, selectAcquisition, validAcquisition } from '../lib/acquisition-domain.mjs';
test('acquisition filters distinguish direct sales, reward currencies and unknown terms', () => {
  const terms = (kind, currencyOriginal = null) => ({kind,currencyOriginal,location:{original:'unknown'}});
  assert.equal(acquisitionMethod(terms('shop','八音窍')),'shop');
  assert.equal(acquisitionMethod(terms('exchange_shop','八音窍')),'resonance');
  assert.equal(acquisitionMethod(terms('exchange_shop','Harmonic Core')),'resonance');
  assert.equal(acquisitionMethod(terms('exchange','音玉')),'sound-jade');
  assert.equal(acquisitionMethod(terms('exchange_shop','Sound Jade')),'sound-jade');
  assert.equal(acquisitionMethod(terms('exchange_shop')),'exchange');
  assert.equal(acquisitionMethod(terms('battle_pass')),'battle-pass');
  assert.equal(acquisitionMethod(terms('quest')),'gameplay');
  assert.equal(acquisitionMethod(terms('event')),'event');
  assert.equal(acquisitionMethod({...terms('unknown'),location:{original:'Battle Pass'}}),'unknown');
  for (const invalid of [null,undefined,'__proto__','constructor','price']) assert.equal(validAcquisition(invalid),'all');
});
test('acquisition filters and card terms use the same server without a cross-region fallback', () => {
  const shop={kind:'shop',currencyOriginal:'长鸣珠',location:{original:'商店'},amount:1280};
  const pass={kind:'battle_pass',currencyOriginal:null,location:{original:'Battle Pass'},amount:null};
  const c={acquisitionServer:'CN',acquisition:shop};
  const global={acquisition:pass};
  assert.equal(selectAcquisition(c,null,global,'all','battle-pass').server,'Global');
  assert.equal(selectAcquisition(c,null,global,'all','shop').acquisition,shop);
  assert.equal(selectAcquisition(c,null,global,'global','shop'),null);
  assert.equal(selectAcquisition(c,null,global,'cn','battle-pass'),null);
  assert.equal(selectAcquisition(c,null,null,'global','shop'),null);
  assert.deepEqual(selectAcquisition(c,null,null,'global','unknown'),{server:'Global',acquisition:null});
  assert.equal(selectAcquisition(c,null,null,'all','unknown'),null);
  assert.equal(selectAcquisition(c,null,global,'global-upcoming','battle-pass').acquisition,pass);
  assert.equal(selectAcquisition(c,null,global,'cn-upcoming','shop').acquisition,shop);
  const globalOnly={acquisitionServer:'Global',acquisition:pass};
  assert.equal(selectAcquisition(globalOnly,null,null,'cn','battle-pass'),null);
  assert.equal(selectAcquisition(globalOnly,null,null,'all','battle-pass').server,'Global');
});
test('Forged in Fire no longer inherits the unrelated CN red-cloth outfit', () => {
  const cn=research.cosmetics.find(c=>c.id==='yan-juan-can-ye');
  const global=research.cosmetics.find(c=>c.id==='global-forged-in-fire');
  assert.equal(cn.nameOriginal,'焰卷残夜');
  assert.equal(cn.officialNameEn,null);
  assert.equal(global.officialNameKo,'불길에 단련된 철골');
  assert.equal(global.acquisitionServer,'Global');
  assert.equal(global.cnRelease.date,null);
  assert.equal(cn.images.length,1);
  assert.equal(global.images.length,4);
  assert.notEqual(cn.images[0].url,global.images[0].url);
  assert.equal(read('regional-records.json').records.some(r=>r.cosmeticId===cn.id && r.server==='Global'),false);
  assert.equal(read('global-events.json').events.some(e=>e.cosmeticId===global.id),true);
  for (const c of [cn,global]) {
    const records=media.filter(m=>m.cosmeticId===c.id);
    assert.equal(records.length,c.images.length);
    assert.deepEqual(records.map(m=>m.originalUrl),c.images.map(image=>image.url));
  }
});
test('regional release status distinguishes future, unknown, and overdue evidence', () => {
  const today = '2026-09-13';
  const future = {status:'announced',releaseDate:'2026-09-16'};
  const released = {status:'released',releaseDate:'2026-09-01'};
  assert.equal(releaseState(future,today),'announced');
  assert.equal(releaseState({...future,status:'released'},today),'announced');
  assert.equal(releaseState(future,'2026-09-16'),'announced');
  assert.equal(releaseState(future,'2026-09-17'),'pending');
  assert.equal(releaseState({...future,releaseDate:null},today),'announced');
  assert.equal(releaseState({...future,releaseDate:null,confirmationPending:true},today),'pending');
  assert.equal(releaseState({...released,releaseDate:null},today),'released');
  assert.equal(releaseState(null,today),'unknown');
  assert.equal(matchesReleaseFilter(future,released,'cn',today),false);
  assert.equal(matchesReleaseFilter(future,released,'cn-upcoming',today),true);
  assert.equal(matchesReleaseFilter(future,released,'global-upcoming',today),false);
  assert.equal(matchesReleaseFilter(released,future,'global-upcoming',today),true);
  assert.equal(matchesReleaseFilter(null,null,'cn-upcoming',today),false);
  assert.equal(matchesReleaseFilter(future,released,'cn-upcoming','2026-09-17'),false);
  assert.equal(matchesReleaseFilter(future,released,'pending','2026-09-17'),true);
  for (const filter of ['cn-upcoming','global-upcoming','pending']) assert.equal(validServer(filter),filter);
  const guarded = globalOutlook('test',{...future,status:'released'},[],[],today);
  assert.equal(guarded.kind,'official'); assert.equal(guarded.days,3);
});
test('historical CN announcement corrections preserve evidence without inventing future dates', () => {
  const records=read('regional-records.json').records;
  const pending=records.filter(r=>r.server==='CN' && r.confirmationPending);
  for (const record of pending) {
    assert.equal(record.status,'announced');
    assert.equal(record.releaseDate,null);
    assert.ok(record.sourceIds.includes(research.cosmetics.find(c=>c.id===record.cosmeticId).sourceId));
    assert.equal(releaseState(record,'2026-09-13'),'pending');
    assert.equal(matchesReleaseFilter(record,null,'cn','2026-09-13'),false);
    assert.equal(matchesReleaseFilter(record,null,'cn-upcoming','2026-09-13'),false);
  }
  assert.equal(releaseState(records.find(r=>r.cosmeticId==='xue-man-chuan' && r.server==='CN'),'2026-09-13'),'released');
  assert.equal(releaseState(records.find(r=>r.cosmeticId==='zhen-han-liu' && r.server==='Global'),'2026-09-13'),'announced');
});
test('archive date order keeps unknowns last, separates servers, and uses stable names', () => {
  const rows = [
    {id:'b',name:'Beta',cnDate:'2025-01-01',globalDate:'2026-09-01',upcomingDate:null},
    {id:'a',name:'Alpha',cnDate:'2026-06-01',globalDate:'2025-11-14',upcomingDate:'2026-10-21'},
    {id:'c',name:'Gamma',cnDate:null,globalDate:null,upcomingDate:'2026-10-01'},
    {id:'d',name:'Delta',cnDate:null,globalDate:'2026-09-01',upcomingDate:null},
  ];
  const order = sort => sortArchive(rows,sort,'en').map(r=>r.id);
  assert.deepEqual(order('cn-newest'),['a','b','d','c']);
  assert.deepEqual(order('cn-oldest'),['b','a','d','c']);
  assert.deepEqual(order('global-newest'),['b','d','a','c']);
  assert.deepEqual(order('global-oldest'),['a','b','d','c']);
  assert.deepEqual(order('upcoming'),['c','a','b','d']);
  assert.deepEqual(order('name-desc'),['c','d','b','a']);
  assert.equal(validSort('price'),'latest');
  assert.equal(rows[0].id,'b');
});
test('official countdown uses calendar days and never implies an unverified past release', () => {
  const event={cosmeticId:'test',server:'Global',kind:'release',status:'announced',date:'2026-10-21'};
  assert.equal(daysUntil('2026-10-21','2026-09-13'),38);
  assert.equal(daysUntil('2026-11-02','2026-11-01'),1);
  assert.equal(daysUntil('2026-02-30','2026-09-13'),null);
  assert.equal(globalOutlook('test',null,[event],[],'2026-09-13').days,38);
  assert.equal(globalOutlook('test',null,[event],[],'2026-10-21').days,0);
  assert.equal(globalOutlook('test',null,[event],[],'2026-10-22').pending,true);
  assert.equal(globalOutlook('test',null,[event],[],'2026-10-22').sortDate,null);
  assert.equal(globalOutlook('test',{status:'released'},[event],[],'2026-09-13'),null);
  assert.equal(globalOutlook('test',null,[{...event,status:'cancelled'}],[],'2026-09-13'),null);
  assert.equal(globalOutlook('test',null,[{...event,kind:'rerun'}],[],'2026-09-13'),null);
  assert.equal(globalOutlook('test',{status:'announced',releaseDate:null},[],[],'2026-09-13').days,null);
});
test('forecasts retain precision, latest revisions and review expiry; official evidence takes priority', () => {
  const f={...fixture, cosmeticId:'test',createdAt:'2026-09-13T00:00:00Z',reviewDue:'2026-12-31',precision:'window',month:undefined,start:'2027-01-09',end:'2027-01-23'};
  const outlook=globalOutlook('test',null,[],[f],'2026-09-13');
  assert.equal(outlook.kind,'forecast');
  assert.equal(outlook.days,118); assert.equal(outlook.endDays,132);
  const month={...f,precision:'month',month:'2026-12',start:undefined,end:undefined};
  assert.equal(globalOutlook('test',null,[],[month],'2026-09-13').days,null);
  assert.equal(globalOutlook('test',null,[],[month],'2026-09-13').month,'2026-12');
  const version={...month,precision:'version',month:undefined,version:'3.0'};
  assert.equal(globalOutlook('test',null,[],[version],'2026-09-13').sortDate,null);
  assert.equal(globalOutlook('test',null,[],[f,{...f,revision:2,state:'withdrawn'}],'2026-09-13'),null);
  assert.equal(globalOutlook('test',null,[],[{...f,reviewDue:'2026-09-12'}],'2026-09-13'),null);
  assert.equal(globalOutlook('test',null,[],[{...f,end:'2026-09-12',start:'2026-09-01'}],'2026-09-13'),null);
  assert.equal(globalOutlook('test',{status:'announced',releaseDate:'2026-10-21'},[],[f],'2026-09-13').kind,'official');
});

 test('archive server choices merge legacy both-server links into all servers', () => {
  assert.equal(validServer('both'),'all');
  assert.equal(validServer('all'),'all');
  assert.equal(validServer('cn'),'cn');
  assert.equal(validServer('global'),'global');
  assert.equal(validServer('invalid'),'all');
});

import { currentForecasts, upcomingEntries } from '../lib/roadmap-domain.mjs';
test('calendar estimates and roadmap share every active window, including later months and versions', () => {
  const events=read('global-events.json').events;
  const revisions=read('forecasts.json').revisions;
  const released=read('regional-records.json').records.filter(r=>r.server==='Global'&&r.status==='released').map(r=>r.cosmeticId);
  const calendar=currentForecasts(events,revisions,'2026-09-23',released);
  const timeline=upcomingEntries(events,revisions,'2026-09-23','forecast',released).map(entry=>entry.forecast);
  assert.deepEqual(calendar,timeline);
  assert.equal(calendar.length,5);
  assert.ok(calendar.some(f=>f.start>'2026-09-30'));
  const version={...fixture,id:'future-version',precision:'version',version:'3.0',month:undefined};
  assert.equal(currentForecasts([], [version], '2026-09-23')[0].version,'3.0');
});
test('all official dates precede forecasts even when forecast windows begin earlier', () => {
  const events = ['2026-09-27', '2026-09-25'].map((date, i) => ({id:`official-${i}`, cosmeticId:`official-${i}`, kind:'release', status:'announced', date}));
  const revisions = [
    {...fixture, id:'later', cosmeticId:'later', month:'2026-10'},
    {...fixture, id:'earlier', cosmeticId:'earlier', month:'2026-09'},
    {...fixture, id:'version', cosmeticId:'version', precision:'version', month:undefined, version:'3.0'},
  ];
  const rows = upcomingEntries(events, revisions, '2026-09-23');
  assert.deepEqual(rows.map(row => row.event?.id ?? row.forecast.id), ['official-1', 'official-0', 'earlier', 'later', 'version']);
  assert.deepEqual(upcomingEntries(events, revisions, '2026-09-23', 'forecast').map(row => row.forecast.id), ['earlier', 'later', 'version']);
  assert.deepEqual(events.map(event => event.date), ['2026-09-27', '2026-09-25']);
});
test('roadmap prioritizes official announcements, hides elapsed announcements, and retains overdue estimates until their window ends', () => {
  const f={...fixture,id:'f',cosmeticId:'fan',precision:'window',month:undefined,start:'2026-09-16',end:'2026-10-31',reviewDue:'2026-09-16'};
  const official={id:'announcement',cosmeticId:'pass',kind:'release',status:'announced',date:'2026-09-16'};
  const today='2026-09-13';
  const rows=upcomingEntries([official],[f],today);
  assert.deepEqual(rows.map(r=>r.kind),['official','forecast']);
  assert.equal(rows[1].forecast.end,'2026-10-31');
  assert.equal(upcomingEntries([official],[f],today,'official').length,1);
  assert.equal(upcomingEntries([official],[f],today,'forecast').length,1);
  assert.equal(upcomingEntries([],[f],today,'all',['fan']).length,0);
  assert.equal(upcomingEntries([{...official,cosmeticId:'fan'}],[f],today).length,1);
  assert.equal(upcomingEntries([{...official,status:'cancelled'}],[f],today).length,1);
  assert.equal(upcomingEntries([{...official,status:'released',date:today}],[],today).length,0);
  assert.equal(upcomingEntries([official],[],'2026-09-16').length,1);
  assert.equal(upcomingEntries([official],[f],'2026-09-17').length,1);
  assert.equal(upcomingEntries([],[f],'2026-10-31','forecast').length,1);
  assert.equal(upcomingEntries([],[f],'2026-11-01','forecast').length,0);
  assert.equal(upcomingEntries([],[{...f,state:'withdrawn'}],today).length,0);
  assert.equal(upcomingEntries([official],[f],'2026-09-17','official').length,0);
  assert.equal(official.status,'announced');
  assert.equal(official.date,'2026-09-16');
  const currentEstimate={...f,cosmeticId:official.cosmeticId,reviewDue:'2026-12-01'};
  assert.equal(upcomingEntries([official],[currentEstimate],'2026-09-17').length,0);
  assert.equal(upcomingEntries([official],[currentEstimate],'2026-09-17','forecast').length,0);
  assert.equal(upcomingEntries([{...official,kind:'rerun'}],[],'2026-09-17').length,0);
  assert.equal(upcomingEntries([],[f,{...f,revision:2,state:'superseded'}],today).length,0);
});
test('a rerun does not suppress an unreleased forecast and version estimates have no manufactured day', () => {
  const f={...fixture,cosmeticId:'fan',precision:'version',month:undefined,version:'3.0',reviewDue:'2026-12-31'};
  const event={id:'repeat',cosmeticId:'fan',kind:'rerun',status:'announced',date:'2026-09-16'};
  const rows=upcomingEntries([event],[f],'2026-09-13');
  assert.equal(rows.length,2);
  assert.equal(rows[1].forecast.precision,'version');
  assert.equal(rows[1].forecast.start,undefined);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { preferredMedia } from '../lib/media-domain.mjs';
const root=new URL('../',import.meta.url);
const media=JSON.parse(await fs.readFile(new URL('content/media.json',root),'utf8'));
const research=JSON.parse(await fs.readFile(new URL('content/research.json',root),'utf8'));
test('verified female previews take priority without losing source indices or changing fallback order',()=>{
 const records=[{cosmeticId:'outfit',index:0},{cosmeticId:'outfit',index:1,presentationSubject:'female'},{cosmeticId:'other',index:0}];
 assert.deepEqual(preferredMedia(records,'outfit').map(m=>m.index),[1,0]);
 assert.deepEqual(preferredMedia(records,'other').map(m=>m.index),[0]);
 assert.equal(records[0].index,0);
});
test('catalog and gallery images cannot silently become animated assets',async()=>{
 for(const m of media) for(const key of ['thumbnail','full','preview',...(m.display?['display']:[])]) {
  const file=new URL('public'+m[key],root);
  const meta=await sharp(file.pathname).metadata();
  assert.equal(meta.pages??1,1,`Animated image: ${m[key]}`);
  assert.equal(meta.format,'webp');
  assert.ok((await fs.stat(file)).size <= (key==='preview'?20_000:key==='thumbnail'?160_000:2_500_000), `Image budget exceeded: ${m[key]}`);
 }
});
test('selectors match the presentation crop while enlargement retains full artwork', async () => {
 for (const m of media) {
  const full=await sharp(new URL('public'+(m.display??m.full),root).pathname).metadata();
  const preview=await sharp(new URL('public'+m.preview,root).pathname).metadata();
  assert.ok(Math.max(preview.width,preview.height)<=160);
  const scale=Math.min(160/full.width,160/full.height,1);
  assert.ok(Math.abs(preview.width-full.width*scale)<=1 && Math.abs(preview.height-full.height*scale)<=1, `Cropped selector preview: ${m.preview}`);
 }
});
test('presentation crops stay inside the full image and agree with their recorded dimensions', async () => {
 for (const m of media.filter(image=>image.presentationCrop)) {
  const full=await sharp(new URL('public'+m.full,root).pathname).metadata();
  const [left,top,right,bottom]=m.presentationCrop;
  assert.ok(left>=0&&top>=0&&right>left&&bottom>top&&right<=full.width&&bottom<=full.height, m.full);
  assert.equal(m.displayWidth,right-left);
  assert.equal(m.displayHeight,bottom-top);
  assert.notEqual(m.display,m.full);
 }
 const lunar=research.cosmetics.find(c=>c.id==='fu-guang').images[0];
 assert.equal(lunar.sourceCrop[3],4661, 'The bottom artwork border must remain in the full image');
 assert.equal((await sharp(new URL('public/media/fu-guang-0-full.webp',root).pathname).metadata()).height, lunar.height);
});
test('local effect videos match byte records and put playback metadata before frames',async()=>{
 for(const c of research.cosmetics) for(const v of c.officialVideos) {
  if(!v.playback)continue;
  const data=await fs.readFile(new URL('public'+v.playback.src,root));
  assert.equal(data.length,v.playback.bytes);
  assert.ok(data.length<=8_000_000);
  const atoms=[];
  for(let offset=0;offset+8<=data.length;){
   let size=data.readUInt32BE(offset);const kind=data.toString('ascii',offset+4,offset+8);
   if(size===1)size=Number(data.readBigUInt64BE(offset+8));
   if(size===0)size=data.length-offset;
   assert.ok(size>=8&&offset+size<=data.length,'Invalid MP4 atom');
   atoms.push(kind);offset+=size;
  }
  assert.ok(atoms.includes('moov')&&atoms.includes('mdat'));
  assert.ok(atoms.indexOf('moov')<atoms.indexOf('mdat'),'MP4 requires fast-start metadata');
 }
});

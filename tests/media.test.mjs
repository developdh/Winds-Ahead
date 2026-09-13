import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const root=new URL('../',import.meta.url);
const media=JSON.parse(await fs.readFile(new URL('content/media.json',root),'utf8'));
const research=JSON.parse(await fs.readFile(new URL('content/research.json',root),'utf8'));
test('catalog and gallery images cannot silently become animated assets',async()=>{
 for(const m of media) for(const key of ['thumbnail','full']) {
  const file=new URL('public'+m[key],root);
  const meta=await sharp(file.pathname).metadata();
  assert.equal(meta.pages??1,1,`Animated image: ${m[key]}`);
  assert.equal(meta.format,'webp');
  assert.ok((await fs.stat(file)).size <= (key==='thumbnail'?160_000:2_500_000), `Image budget exceeded: ${m[key]}`);
 }
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

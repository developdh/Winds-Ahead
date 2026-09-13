import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
// Private reference derivatives. Attribution is not a redistribution license.
const data=JSON.parse(await fs.readFile('content/research.json','utf8'));
const out='public/media';await fs.mkdir(out,{recursive:true});
const records=[];
for(const c of data.cosmetics){for(let i=0;i<c.images.length;i++){
 const input=path.join(process.argv[2]??'/private/tmp/winds-ahead-originals',`${c.id}-${i}.img`);
 const meta=await sharp(input).metadata();
 const top=c.category==='hair'?Math.round(meta.width*.32):Math.round(meta.width*.1);
 const region=meta.height>meta.width*2?{left:0,top,width:meta.width,height:Math.round(meta.width*1.18)}:null;
 const key=`${c.id}-${i}`;
 let thumb=sharp(input);if(region)thumb=thumb.extract(region);
 await thumb.resize(600,710,{fit:'cover',position:'attention'}).webp({quality:79}).toFile(`${out}/${key}-thumb.webp`);
 await sharp(input).resize({width:900,withoutEnlargement:true}).webp({quality:80}).toFile(`${out}/${key}-full.webp`);
 records.push({cosmeticId:c.id,index:i,originalUrl:c.images[i].url,thumbnail:`/media/${key}-thumb.webp`,full:`/media/${key}-full.webp`,thumbnailBytes:(await fs.stat(`${out}/${key}-thumb.webp`)).size,fullBytes:(await fs.stat(`${out}/${key}-full.webp`)).size,permission:'unknown',audience:'owner-private reference preview'});
}}
await fs.writeFile('content/media.json',JSON.stringify(records,null,2)+'\n');
console.log(records.map(x=>({id:x.cosmeticId,thumb:x.thumbnailBytes,full:x.fullBytes})));

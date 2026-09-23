import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Keep editorial presentation crops separate from the full gallery artwork.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = path.join(root, 'content/media.json');
const media = JSON.parse(await fs.readFile(manifest, 'utf8'));
for (const image of media) {
  if (image.presentationCrop) {
    const [left, top, right, bottom] = image.presentationCrop;
    const cropped = await sharp(path.join(root, 'public', image.full))
      .extract({ left, top, width: right - left, height: bottom - top }).png().toBuffer();
    image.display = image.full.replace(/-full\.webp$/, '-display.webp');
    await sharp(cropped).webp({ quality: 84 }).toFile(path.join(root, 'public', image.display));
    image.displayWidth = right - left;
    image.displayHeight = bottom - top;
    image.displayBytes = (await fs.stat(path.join(root, 'public', image.display))).size;
    await sharp(cropped).resize(600, 710, { fit: 'cover', position: 'attention' })
      .webp({ quality: 79 }).toFile(path.join(root, 'public', image.thumbnail));
    image.thumbnailBytes = (await fs.stat(path.join(root, 'public', image.thumbnail))).size;
  }
  image.preview = image.full.replace(/-full\.webp$/, '-preview.webp');
  if (image.preview === image.full) throw new Error(`Unexpected full-image path: ${image.full}`);
  const destination = path.join(root, 'public', image.preview);
  await sharp(path.join(root, 'public', image.display ?? image.full))
    .resize(160, 160, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72 }).toFile(destination);
  image.previewBytes = (await fs.stat(destination)).size;
}
await fs.writeFile(manifest, JSON.stringify(media, null, 2) + '\n');
console.log(`Updated ${media.length} previews, including ${media.filter(image => image.presentationCrop).length} poster presentation crops.`);

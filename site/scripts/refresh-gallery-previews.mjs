import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Small gallery selectors show the same complete composition as the full image.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = path.join(root, 'content/media.json');
const media = JSON.parse(await fs.readFile(manifest, 'utf8'));
for (const image of media) {
  image.preview = image.full.replace(/-full\.webp$/, '-preview.webp');
  if (image.preview === image.full) throw new Error(`Unexpected full-image path: ${image.full}`);
  const destination = path.join(root, 'public', image.preview);
  await sharp(path.join(root, 'public', image.full))
    .resize(160, 160, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72 }).toFile(destination);
  image.previewBytes = (await fs.stat(destination)).size;
}
await fs.writeFile(manifest, JSON.stringify(media, null, 2) + '\n');
console.log(`Updated ${media.length} uncropped gallery previews.`);

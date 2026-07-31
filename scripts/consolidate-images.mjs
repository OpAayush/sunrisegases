import sharp from 'sharp';
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const SRC_ICONS = 'public/images/icons';
const DST_ASSETS = 'src/assets/products';
const DST_PUBLIC = 'public';

const EXIF_DESC = {
  IFD0: {
    ImageDescription: 'Sunrise Gases — industrial and specialty gas manufacturer in Nagpur, Maharashtra, India',
  },
};

async function optimize(src, out, { quality = 82, maxWidth = 1200, description = '' } = {}) {
  let img = sharp(src).rotate();
  const meta = await img.metadata();
  if (meta.width > maxWidth) {
    img = img.resize({ width: maxWidth, withoutEnlargement: true });
  }
  const opts = description ? { quality, effort: 6, withMetadata: EXIF_DESC } : { quality, effort: 6 };
  await img.webp(opts).toFile(out);
  console.log(`${src} -> ${out} (${meta.width}x${meta.height})`);
}

async function generatePng(src, out, width, { description = '' } = {}) {
  let img = sharp(src).rotate().resize({ width, height: width, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } });
  if (description) img = img.withMetadata(EXIF_DESC);
  await img.png().toFile(out);
  console.log(`${out} (${width}px)`);
}

await mkdir(DST_ASSETS, { recursive: true });

await optimize('public/SUNRISE GASES LOGO.jpg', path.join(DST_ASSETS, 'logo-sunrise-gases.webp'), {
  quality: 85, maxWidth: 1200, description: EXIF_DESC,
});
await optimize('public/square logo.png', path.join(DST_ASSETS, 'logo-sunrise-gases-square.webp'), {
  quality: 85, maxWidth: 800, description: EXIF_DESC,
});
await optimize('public/images/products/industrial-factory.jpg', path.join(DST_ASSETS, 'factory-nagpur.webp'), {
  quality: 80, maxWidth: 800, description: EXIF_DESC,
});

for (const name of await readdir(SRC_ICONS)) {
  if (name === 'apple-touch-icon.png') continue;
  const dst = path.join(DST_ASSETS, `icon-${name}`);
  await copyFile(path.join(SRC_ICONS, name), dst);
  console.log(`icon: ${name} -> ${path.basename(dst)}`);
}

await generatePng('public/square logo.png', path.join(DST_PUBLIC, 'favicon-16x16.png'), 16, { description: EXIF_DESC });await generatePng('public/square logo.png', path.join(DST_PUBLIC, 'favicon-32x32.png'), 32, { description: EXIF_DESC });
await generatePng('public/square logo.png', path.join(DST_PUBLIC, 'apple-touch-icon.png'), 180, { description: EXIF_DESC });
await generatePng('public/square logo.png', path.join(DST_PUBLIC, 'android-chrome-192x192.png'), 192, { description: EXIF_DESC });
await generatePng('public/square logo.png', path.join(DST_PUBLIC, 'android-chrome-512x512.png'), 512, { description: EXIF_DESC });

const logo = sharp('public/SUNRISE GASES LOGO.jpg').rotate();
const logoMeta = await logo.metadata();
const scale = Math.min(1026 / logoMeta.width, 560 / logoMeta.height);
const w = Math.round(logoMeta.width * scale);
const h = Math.round(logoMeta.height * scale);
const resized = await logo.resize({ width: w, height: h, fit: 'fill' }).png().toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
})
  .composite([{ input: resized, left: Math.round((1200 - w) / 2), top: Math.round((630 - h) / 2) }])
  .withMetadata(EXIF_DESC)
  .png()
  .toFile(path.join(DST_PUBLIC, 'og-image.png'));
console.log('og-image.png (1200x630)');

await rm('public/images', { recursive: true, force: true });
await rm('public/homepage.jpg', { force: true });
await rm('public/homepage2.jpeg', { force: true });
await rm('public/SUNRISE GASES LOGO.jpg', { force: true });
await rm('public/square logo.png', { force: true });
console.log('cleaned raw originals from public/');

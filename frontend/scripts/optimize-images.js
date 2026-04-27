#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const IMG_DIRS = [
  path.resolve('public'),
  path.resolve('src', 'assets')
];
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const SIZES = [320, 640, 960, 1280, 1920];

async function findImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const images = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      images.push(...await findImages(full));
    } else {
      if (EXTENSIONS.includes(path.extname(e.name).toLowerCase())) images.push(full);
    }
  }
  return images;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function convertImage(file) {
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);
  console.log('Processing', file);
  try {
    // produce AVIF and WEBP at multiple sizes
    for (const fmt of ['webp', 'avif']) {
      for (const w of SIZES) {
        const out = `${base}-${w}.${fmt}`;
        await ensureDir(out);
        await sharp(file).resize({ width: w }).toFormat(fmt, { quality: 75 }).toFile(out);
      }
    }
  } catch (err) {
    console.error('Failed to convert', file, err.message);
  }
}

(async () => {
  for (const d of IMG_DIRS) {
    try {
      const imgs = await findImages(d);
      console.log(`Found ${imgs.length} images in ${d}`);
      for (const img of imgs) await convertImage(img);
    } catch (err) {
      // ignore missing folders
    }
  }
  console.log('Image optimization complete.');
})();

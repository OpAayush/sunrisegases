import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = 'public/images_new';
const OUT = 'src/assets/products';
const MAX_WIDTH = 1200;

const mappings = {
  '1025081_Hydrogen-Pallet.jpg': 'hydrogen-pallet',
  '31861600_oxygen_500x476.jpg': 'oxygen-cylinder',
  'ad balloon 2.jpg': 'advertising-balloon-2',
  'ad baloon 1.jpg': 'advertising-balloon-1',
  'Argon-shield.jpg': 'argon-shield',
  'calibration-gas-mixtures-1519631683-3679801.jpeg': 'calibration-gas-mixtures',
  'co2.jpg': 'co2-cylinder',
  'dry ice.jpg': 'dry-ice-blocks',
  'fire extinguishers.jpg': 'fire-extinguishers',
  'gas regulators.jpg': 'gas-regulators',
  'gas-cylinder-manifolds.png': 'gas-cylinder-manifolds',
  'gas-cylinder-trolley-500x500.jpg': 'gas-cylinder-trolley',
  'gas-manifold-system-500x500.jpg': 'gas-manifold-system',
  'helium.jpg': 'helium-cylinder',
  'hydrogen-gas-cylinder-500x500.jpg': 'hydrogen-gas-cylinder',
  'hydrogen-gas-cylinders-221934.jpg': 'hydrogen-gas-cylinders',
  'Industrial Gas regulators.jpg': 'industrial-gas-regulators',
  'nitrogen.png': 'nitrogen-cylinder',
  'Oxyen.jpg': 'oxygen-cylinder-blue',
  'oxygen.jpg': 'oxygen-cylinder-industrial',
  'P10 gas cyl.jpg': 'p10-gas-cylinder',
  'safety guards for cylinders.jpg': 'cylinder-safety-guards',
};

await mkdir(OUT, { recursive: true });

let totalIn = 0;
let totalOut = 0;

for (const [file, name] of Object.entries(mappings)) {
  const srcPath = join(SRC, file);
  const srcStat = await stat(srcPath);
  const img = sharp(srcPath);
  const meta = await img.metadata();

  const pipeline = img.clone();
  if (meta.width > MAX_WIDTH) pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  await pipeline
    .rotate()
    .webp({ quality: 82, effort: 6 })
    .toFile(join(OUT, `${name}.webp`));

  const outStat = await stat(join(OUT, `${name}.webp`));
  totalIn += srcStat.size;
  totalOut += outStat.size;
  const saved = ((1 - outStat.size / srcStat.size) * 100).toFixed(0);
  console.log(
    `${file}  (${meta.width}x${meta.height}, ${(srcStat.size / 1024).toFixed(0)} KB) -> ${name}.webp (${(outStat.size / 1024).toFixed(0)} KB, ${saved}% smaller)`
  );
}

console.log(`\nTotal: ${(totalIn / 1024).toFixed(0)} KB -> ${(totalOut / 1024).toFixed(0)} KB (${((1 - totalOut / totalIn) * 100).toFixed(0)}% reduction)`);

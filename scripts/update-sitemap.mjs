import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapPath = path.join(repoRoot, 'public', 'sitemap.xml');

const staticMap = new Map([
  ['/', 'src/pages/index.astro'],
  ['/gases/', 'src/pages/gases/index.astro'],
  ['/gas-mixtures/', 'src/pages/gas-mixtures/index.astro'],
  ['/specialty-gases/', 'src/pages/specialty-gases/index.astro'],
  ['/refrigerants/', 'src/pages/refrigerants/index.astro'],
  ['/cryogenic/', 'src/pages/cryogenic/index.astro'],
  ['/equipment/', 'src/pages/equipment/index.astro'],
  ['/fire-safety/', 'src/pages/fire-safety/index.astro'],
  ['/balloons/', 'src/pages/balloons/index.astro'],
  ['/industries/', 'src/pages/industries/index.astro'],
  ['/about/', 'src/pages/about.astro'],
  ['/quality-and-safety/', 'src/pages/quality-and-safety.astro'],
  ['/contact/', 'src/pages/contact.astro'],
]);

const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

async function sourceFor(pathname) {
  if (staticMap.has(pathname)) return staticMap.get(pathname);
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 2) {
    const [dir, slug] = parts;
    const jsonDir = path.join(repoRoot, 'src', 'content', dir);
    const files = await readdir(jsonDir).catch(() => null);
    if (files) {
      for (const name of files) {
        if (!name.endsWith('.json')) continue;
        const data = JSON.parse(await readFile(path.join(jsonDir, name), 'utf8'));
        if (data.slug === slug) return path.join('src', 'content', dir, name);
      }
    }
  }
  throw new Error(`No source file mapping for sitemap URL path: ${pathname}`);
}

const xml = await readFile(sitemapPath, 'utf8');
const urlBlocks = xml.match(/<url\b[\s\S]*?<\/url>/g) ?? [];
const updated = [];

for (const block of urlBlocks) {
  const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/);
  if (!locMatch) continue;
  const loc = locMatch[1];
  const pathname = new URL(loc).pathname;
  const source = await sourceFor(pathname);
  const fullPath = path.join(repoRoot, source);
  const mtime = (await stat(fullPath)).mtime;
  const lastmod = mtime.toISOString().slice(0, 10);

  const children = [...block.matchAll(/<(?!url)(\w+)>([\s\S]*?)<\/\1>/g)].map((m) => ({
    name: m[1],
    value: m[2],
  }));

  const lastmodIndex = children.findIndex((c) => c.name === 'lastmod');
  if (lastmodIndex === -1) {
    const locIndex = children.findIndex((c) => c.name === 'loc');
    children.splice(locIndex + 1, 0, { name: 'lastmod', value: lastmod });
  } else {
    children[lastmodIndex].value = lastmod;
  }

  let rebuilt = '<url>';
  for (const child of children) {
    rebuilt += `\n    <${child.name}>${escapeXml(child.value)}</${child.name}>`;
  }
  rebuilt += '\n  </url>';
  updated.push(rebuilt);
}

const result = xml.replace(/<url\b[\s\S]*?<\/url>/g, () => updated.shift() ?? '');
await writeFile(sitemapPath, result, 'utf8');
console.log(`Updated lastmod for ${urlBlocks.length} URLs in public/sitemap.xml`);

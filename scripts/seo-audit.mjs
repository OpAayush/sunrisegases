#!/usr/bin/env node
// SEO audit for sunrisegases.com — audits BUILT HTML (dist/client) with a real
// parser approach (HTML comments stripped first), plus live-site checks.
// Usage: node scripts/seo-audit.mjs [--live]

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = join(process.cwd(), 'dist', 'client');
const ORIGIN = 'https://sunrisegases.com';
const LIVE = process.argv.includes('--live');

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(DIST);

const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, '');
const unescapeHtml = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const get = (html, re) => { const m = stripComments(html).match(re); return m ? m[1] : null; };
const getAll = (html, re) => { const out = []; const s = stripComments(html); let m; const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'); while ((m = r.exec(s))) out.push(m[1] ?? m[0]); return out; };

const report = [];
const flag = (sev, page, msg) => report.push({ sev, page, msg });
const sevRank = { HIGH: 0, MED: 1, LOW: 2, OK: 3 };

const pages = files.map((f) => {
  const html = readFileSync(f, 'utf8');
  const path = '/' + relative(DIST, f).split('\\').join('/').replace(/index\.html$/, '');
  const clean = stripComments(html);

  const title = get(clean, /<title>([\s\S]*?)<\/title>/i)?.trim();
  const desc = get(clean, /<meta\s+name=["']description["']\s+content="([^"]*)"/i);
  const canonicals = getAll(clean, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const h1s = getAll(clean, /<h1[^>]*>([\s\S]*?)<\/h1>/i).map((s) => s.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  const imgs = getAll(clean, /<img\s[^>]*>/gi).map((t) => ({ alt: get(t, /alt=["']([^"']*)["']/i) ?? null, src: get(t, /src=["']([^"']*)["']/i) ?? '?' }));
  const og = { title: get(clean, /<meta\s+property=["']og:title["']\s+content="([^"]*)"/i), desc: get(clean, /<meta\s+property=["']og:description["']\s+content="([^"]*)"/i), img: get(clean, /<meta\s+property=["']og:image["']\s+content="([^"]*)"/i) };
  const tw = { card: get(clean, /<meta\s+name=["']twitter:card["']\s+content="([^"]*)"/i) };
  const links = getAll(clean, /<a\s[^>]*href=["']([^"']*)["']/gi).filter((h) => !h.startsWith('#') && !h.startsWith('tel:') && !h.startsWith('mailto:') && !h.startsWith('https://wa.me') && !h.startsWith('https://www.google.com'));
  const lds = [];
  const ldRe = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m; const s2 = clean;
  while ((m = ldRe.exec(s2))) {
    try { lds.push(JSON.parse(m[1].trim())); } catch (e) { flag('HIGH', path, `JSON-LD block does not parse: ${e.message}`); }
  }

  return { path, title, desc, canonicals, h1s, imgs, og, tw, links, lds };
});

// ---- per-page checks ----
for (const p of pages) {
  if (!p.title) flag('HIGH', p.path, 'MISSING <title>');
  else if (unescapeHtml(p.title).length > 60) flag('MED', p.path, `title ${p.title.length} chars > 60: "${p.title}"`);
  else flag('OK', p.path, `title OK (${p.title.length})`);

  if (!p.desc) flag('HIGH', p.path, 'MISSING meta description');
  else if (unescapeHtml(p.desc).length < 100 || unescapeHtml(p.desc).length > 165) flag('LOW', p.path, `meta description ${p.desc.length} chars (want 140-160)`);

  if (p.canonicals.length !== 1) flag('HIGH', p.path, `expected exactly 1 canonical, found ${p.canonicals.length}: ${JSON.stringify(p.canonicals)}`);
  else if (p.path === '/404.html') flag('OK', p.path, `404 page canonical OK (intentionally ${p.canonicals[0]})`);
  else {
    const c = p.canonicals[0];
    const expect = ORIGIN + (p.path.endsWith('/') ? p.path : p.path + '/');
    if (!c.startsWith(ORIGIN)) flag('HIGH', p.path, `canonical not absolute/site: ${c}`);
    else if (c !== expect) flag('MED', p.path, `canonical ${c} != expected ${expect}`);
    else flag('OK', p.path, `canonical OK ${c}`);
  }

  if (p.h1s.length !== 1) flag('MED', p.path, `expected 1 H1, found ${p.h1s.length}: ${JSON.stringify(p.h1s)}`);

  for (const img of p.imgs) {
    if (img.alt === null) flag('MED', p.path, `img WITHOUT alt attribute: ${img.src}`);
    else if (img.alt === '' && !/\.svg($|\?)/i.test(img.src)) flag('LOW', p.path, `non-SVG img with EMPTY alt: ${img.src}`);
    else if (img.alt !== '' && img.alt.length < 8) flag('LOW', p.path, `img alt too short (${img.alt.length}): "${img.alt}"`);
  }

  if (!p.og.title || !p.og.desc || !p.og.img) flag('LOW', p.path, 'incomplete OG tags (need og:title/description/image)');
  if (!p.tw.card) flag('LOW', p.path, 'missing twitter:card');

  const types = p.lds.flatMap((ld) => Array.isArray(ld['@graph']) ? ld['@graph'].map((n) => n['@type']) : [ld['@type']]);
  if (!p.lds.length) flag('MED', p.path, 'NO JSON-LD on page');
  for (const t of types) {
    if (t === 'Product') flag('HIGH', p.path, '@type Product present — must not appear without real offers');
    if (t === 'FAQPage') flag('OK', p.path, 'FAQPage present');
    if (t === 'Service') flag('OK', p.path, 'Service present');
    if (t === 'BreadcrumbList') flag('OK', p.path, 'BreadcrumbList present');
    if (t === 'LocalBusiness') flag('OK', p.path, 'LocalBusiness present');
  }
  const hasRating = JSON.stringify(p.lds).match(/"aggregateRating"/);
  if (hasRating) flag('HIGH', p.path, 'aggregateRating found — fabrication risk');
  const hasCatalog = JSON.stringify(p.lds).match(/"hasOfferCatalog"/);
  if (hasCatalog) flag('HIGH', p.path, 'hasOfferCatalog found — phantom Product bug regressed');
}

// ---- uniqueness checks ----
const titleCount = {};
for (const p of pages) titleCount[p.title] = (titleCount[p.title] ?? 0) + 1;
for (const [t, c] of Object.entries(titleCount)) if (c > 1) flag('MED', `ALL`, `duplicate <title> (${c} pages): "${t}"`);
const descCount = {};
for (const p of pages) descCount[p.desc] = (descCount[p.desc] ?? 0) + 1;
for (const [d, c] of Object.entries(descCount)) if (c > 1) flag('MED', 'ALL', `duplicate meta description (${c} pages): "${d?.slice(0, 60)}…"`);

// ---- internal link integrity (against built files) ----
const builtPaths = new Set(pages.map((p) => p.path));
const norm = (h) => {
  let u = h.split('#')[0].split('?')[0];
  if (!u.startsWith('/')) return null;
  if (u.endsWith('/')) return u;
  return u + '/';
};
const incoming = new Map(pages.map((p) => [p.path, 0]));
for (const p of pages) {
  for (const h of p.links) {
    const n = norm(h);
    if (n === null) continue; // external
    if (!builtPaths.has(n)) flag('HIGH', p.path, `broken internal link target not in build: ${h} (from ${p.path})`);
    else incoming.set(n, incoming.get(n) + 1);
  }
}
for (const p of pages) {
  if (p.path !== '/' && p.path !== '/404.html' && !incoming.get(p.path)) flag('MED', p.path, 'ORPHAN: no internal links point to this page');
}

// ---- cross-reference checks ----
const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
const sitemapXml = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf8') : null;
if (!sitemapXml) flag('HIGH', 'ALL', 'public/sitemap.xml missing');
else {
  const locs = getAll(sitemapXml, /<loc>([^<]*)<\/loc>/g);
  const withoutSlash = locs.filter((l) => !l.endsWith('/'));
  if (withoutSlash.length) flag('HIGH', 'ALL', `sitemap locs without trailing slash: ${withoutSlash.join(', ')}`);
  const sitemapPaths = new Set(locs.map((l) => new URL(l).pathname));
  const EXCLUDED_FROM_SITEMAP = new Set(['/404.html']);
  const missing = pages.filter((p) => !EXCLUDED_FROM_SITEMAP.has(p.path) && !sitemapPaths.has(p.path)).map((p) => p.path);
  if (missing.length) flag('HIGH', 'ALL', `built pages NOT in sitemap: ${missing.join(', ')}`);
  const extra = locs.filter((l) => !builtPaths.has(new URL(l).pathname));
  if (extra.length) flag('HIGH', 'ALL', `sitemap URLs NOT in build (dead): ${extra.join(', ')}`);
  const noLastmod = locs.length - getAll(sitemapXml, /<lastmod>([^<]*)<\/lastmod>/g).length;
  if (noLastmod) flag('MED', 'ALL', `${noLastmod} sitemap URLs missing <lastmod>`);
  flag('OK', 'ALL', `sitemap has ${locs.length} URLs`);
}

for (const f of ['robots.txt', 'llms.txt']) {
  if (!existsSync(join(process.cwd(), 'public', f))) flag('MED', 'ALL', `public/${f} missing`);
  else flag('OK', 'ALL', `public/${f} present`);
}

// ---- live checks ----
if (LIVE) {
  const getH = (url) => fetch(url, { redirect: 'manual' });
  for (const p of pages) {
    try {
      const r = await getH(ORIGIN + p.path);
      if (r.status !== 200) flag('HIGH', p.path, `live HTTP ${r.status} for ${p.path}`);
    } catch (e) { flag('MED', p.path, `live fetch failed: ${e.message}`); }
  }
  for (const p of pages) {
    if (p.canonicals.length === 1) {
      try {
        const r = await getH(p.canonicals[0]);
        if (r.status !== 200) flag('HIGH', p.path, `canonical target ${p.canonicals[0]} returns HTTP ${r.status} (redirects?)`);
        else flag('OK', p.path, `canonical resolves 200`);
      } catch (e) { flag('MED', p.path, `canonical fetch failed: ${e.message}`); }
    }
  }
  try {
    const noSlash = await getH(ORIGIN + '/gases/oxygen');
    const slash = await getH(ORIGIN + '/gases/oxygen/');
    flag('OK', 'ALL', `slash behavior: /gases/oxygen -> ${noSlash.status} ${noSlash.headers.get('location') ?? ''}; /gases/oxygen/ -> ${slash.status}`);
  } catch (e) { flag('MED', 'ALL', `slash check failed: ${e.message}`); }
}

report.sort((a, b) => sevRank[a.sev] - sevRank[b.sev]);
for (const r of report) console.log(`[${r.sev}] ${r.page} ${r.msg}`);
const counts = report.reduce((a, r) => (a[r.sev] = (a[r.sev] ?? 0) + 1, a), {});
console.log(`\n=== ${files.length} pages audited. HIGH:${counts.HIGH ?? 0} MED:${counts.MED ?? 0} LOW:${counts.LOW ?? 0} OK:${counts.OK ?? 0}`);

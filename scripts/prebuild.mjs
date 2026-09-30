// Runs automatically before `npm run build`.
//
// Generated routes in src/pages (sitemap.xml.ts, llms.txt.ts, llms-full.txt.ts)
// are the single source of truth for those paths. A same-named file in public/
// wins at the Astro level — the route is silently skipped with only a build
// WARN — which is how a stale public/llms.txt and a 51-URL public/sitemap.xml
// outlived several rebuilds. Auto-clear them so the build cannot ship them again.
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

const GENERATED = ['sitemap.xml', 'llms.txt', 'llms-full.txt'];

for (const name of GENERATED) {
  // public/ shadows the route; a repo-root copy is never shipped at all.
  for (const [label, p] of [
    ['public', join(repoRoot, 'public', name)],
    ['repo root', join(repoRoot, name)],
  ]) {
    if (!existsSync(p)) continue;
    rmSync(p);
    console.log(`[prebuild] removed stale ${label}/${name} — src/pages/${name}.ts is generated at build time`);
  }
}
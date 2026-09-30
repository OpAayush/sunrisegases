import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ROUTED, STATIC_PAGES } from '../lib/collections';
import { CONTENT_UPDATED } from '../data/business';
import { LOCAL_PAGES } from '../data/local-pages';

export const GET: APIRoute = async () => {
  const urls = [...STATIC_PAGES, '/locations/', ...LOCAL_PAGES.map((p) => `/${p.slug}/`)];
  for (const c of ROUTED) {
    const items = await getCollection(c as any);
    items.forEach((e: any) => urls.push(`/${c}/${e.data.slug}/`));
  }
  const body = urls.map((u) => `  <url>\n    <loc>https://sunrisegases.com${u}</loc>\n    <lastmod>${CONTENT_UPDATED}</lastmod>\n  </url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

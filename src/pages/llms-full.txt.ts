import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ROUTED } from '../lib/collections';
import { toMarkdown } from '../lib/markdown';

export const GET: APIRoute = async () => {
  const parts: string[] = ['# Sunrise Gases — full site content (Markdown)\n'];
  for (const c of ROUTED) {
    const items = (await getCollection(c as any)).sort((a: any, b: any) => a.data.name.localeCompare(b.data.name));
    items.forEach((e: any) => parts.push(`<!-- https://sunrisegases.com/${c}/${e.data.slug}/ -->\n${toMarkdown(c, e.data)}`));
  }
  return new Response(parts.join('\n---\n\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { ROUTED } from '../lib/collections';
import { toMarkdown } from '../lib/markdown';

export const getStaticPaths: GetStaticPaths = async () => {
  const out: any[] = [];
  for (const c of ROUTED) {
    const items = await getCollection(c as any);
    items.forEach((e: any) => out.push({ params: { slug: `${c}/${e.data.slug}` }, props: { c, d: e.data } }));
  }
  return out;
};

export const GET: APIRoute = ({ props }) =>
  new Response(toMarkdown(props.c, props.d), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });

export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  // TODO: validate payload (zod), verify Turnstile token, then hand off to
  // a Cloudflare Queue producer instead of doing email/D1 writes inline.
  const body = await request.json().catch(() => null);

  if (!body) {
    return new Response(JSON.stringify({ error: 'invalid payload' }), { status: 400 });
  }

  // Placeholder ack — replace with queue.send(body) once LEAD_QUEUE binding exists.
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

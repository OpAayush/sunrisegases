# Future enhancements

Features deferred from initial build. To be implemented when dynamic infrastructure is available.

## Dynamic quote form
- Replace `quote.ts` stub with a Cloudflare Queue-backed inquiry form on `/contact/`
- Submit to Queue → D1 `leads` table → automatic email notification
- Schema: name, company, email, phone, gas/product, quantity, delivery pincode, message

> **Note on `quote.ts` placement:** the stub lives at the repo root, outside
> `src/pages/`, so it is intentionally inert — Astro only builds routes under
> `src/pages/`. Move it to `src/pages/api/quote.ts` (or similar) when wiring the
> form, not before.

> **Note on `run_worker_first` (wrangler.jsonc):** this deployment is currently
> an assets-only static Worker (no `main` script) and `assets.run_worker_first`
> is `false`, which is correct and optimal for the all-static site. When any
> dynamic route is added (quote form, blog search, etc.), the adapter will emit
> `_worker.js` and two coordinated changes are required or the route will 404
> instead of executing:
> 1. Add `"main": "./dist/_worker.js/index.js"` to `wrangler.jsonc`.
> 2. Set `assets.run_worker_first` to a scoped array — `["/api/*"]` — not `true`
>    (blanket `true` routes every static page through Worker invocation first,
>    reintroducing latency/cost; scoping keeps the fast static path intact).

## Blog / news
- Static blog collection with markdown content
- `/blog/` index and per-post pages
- Optional: pagination for future scale

## Search
- Client-side search across all product collections (gases, equipment, fire-safety, balloons)
- Fuse.js or similar lightweight fuzzy search

## Contact form spam protection
- Cloudflare Turnstile integration
- Rate limiting via KV

## Balloons landing page expansion
- Sub-pages for event-specific products (CO₂ jet guns, pyro)
- Gallery section with customer photos
- Custom balloon order form

## Catalogue integration
- Cross-link products to manufacturers or datasheets
- PDF catalogue download

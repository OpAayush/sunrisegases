# Future enhancements

Features deferred from initial build. To be implemented when dynamic infrastructure is available.

## Dynamic quote form
- Replace `quote.ts` stub with a Cloudflare Queue-backed inquiry form on `/contact/`
- Submit to Queue → D1 `leads` table → automatic email notification
- Schema: name, company, email, phone, gas/product, quantity, delivery pincode, message

## Blog / news
- Static blog collection with markdown content
- `/blog/` index and per-post pages
- Optional: pagination for future scale

## Product images / media
- All product JSON currently has empty `images: []` arrays
- Populate with actual product photography or technical diagrams

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

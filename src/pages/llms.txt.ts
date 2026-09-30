import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ROUTED } from '../lib/collections';
import { COLLECTION_LABELS } from '../lib/facts';
import { BUSINESS } from '../data/business';
import { LOCAL_PAGES } from '../data/local-pages';

export const GET: APIRoute = async () => {
  const L = [
    '# Sunrise Gases — Industrial & Specialty Gases, Nagpur',
    '',
    '> Manufacturer and supplier of industrial gases, gas mixtures, refrigerants, cryogenic products (liquid nitrogen, dry ice), gas equipment and fire safety products in Nagpur, Maharashtra, India. Registered office in Sadar; office, godown and dispatch on MIDC Hingna Road. Orders taken 24 hours a day, 7 days a week. Delivery in Nagpur and nearby districts (within roughly 200 km).',
    '',
    `Every product page is also available as plain Markdown by adding .md to its URL (for example ${BUSINESS.url}/gases/helium.md). Full text of all pages: ${BUSINESS.url}/llms-full.txt`,
    '',
  ];
  for (const c of ROUTED) {
    const items = (await getCollection(c as any)).sort((a: any, b: any) => a.data.name.localeCompare(b.data.name));
    L.push(`## ${COLLECTION_LABELS[c]}`, '');
    items.forEach((e: any) => L.push(`- [${e.data.name}](${BUSINESS.url}/${c}/${e.data.slug}/): ${e.data.seo?.description ?? e.data.summary ?? ''}`));
    L.push('');
  }
  L.push('## Services in Nagpur', '');
  LOCAL_PAGES.forEach((p) => L.push(`- [${p.crumb}](${BUSINESS.url}/${p.slug}/): ${p.description}`));
  L.push('');
  L.push('## Company', '', `- [About](${BUSINESS.url}/about/)`, `- [Delivery areas](${BUSINESS.url}/service-area/)`, `- [Quality & safety](${BUSINESS.url}/quality-and-safety/)`, `- [Contact](${BUSINESS.url}/contact/)`, '');
  L.push('## Branches', '');
  BUSINESS.branches.forEach((b) => L.push(`- [${b.name}](${BUSINESS.url}/locations/${b.slug}/): ${b.streetAddress}, Nagpur ${b.postalCode}, Maharashtra, India. ${b.blurb}`));
  L.push('', '## Contact', '', `- Phone: ${BUSINESS.phone}`, `- WhatsApp: https://wa.me/${BUSINESS.whatsapp}`, `- Email: ${BUSINESS.email}`, `- Hours: ${BUSINESS.hoursText}`, '');
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

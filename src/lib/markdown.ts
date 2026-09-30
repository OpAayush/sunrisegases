import { buildFacts } from './facts';
import { BUSINESS } from '../data/business';

const SKIP = new Set(['slug', 'name', 'seo', 'images', 'overview', 'keyFacts', 'about', 'faq', 'safety', 'summary']);
const label = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
const flat = (v: any): string => Array.isArray(v) ? v.map(flat).join(', ') : v && typeof v === 'object' ? Object.values(v).map(flat).join(' — ') : String(v);

export function toMarkdown(collection: string, d: any): string {
  const L: string[] = [`# ${d.name}`, ''];
  const desc = d.seo?.description ?? d.summary;
  if (desc) L.push(`> ${desc}`, '');
  if (d.overview) L.push(d.overview, '');
  const facts = buildFacts(collection, d);
  if (facts.length) {
    L.push('| Property | Value |', '|---|---|');
    facts.forEach(([k, v]) => L.push(`| ${k} | ${String(v).replace(/\|/g, '/')} |`));
    L.push('');
  }
  if (d.about?.length) { L.push(`## About ${d.name}`, ''); d.about.forEach((p: string) => L.push(p, '')); }
  for (const [k, v] of Object.entries(d)) {
    if (SKIP.has(k)) continue;
    if (Array.isArray(v) && v.length) { L.push(`## ${label(k)}`, ''); v.forEach((it) => L.push(`- ${flat(it)}`)); L.push(''); }
    else if (typeof v === 'string' && v) L.push(`**${label(k)}:** ${v}`, '');
  }
  if (d.safety?.hazardClass) L.push(`**Hazard class:** ${d.safety.hazardClass}. Safety Data Sheet available on request.`, '');
  if (d.faq?.length) { L.push('## Frequently asked questions', ''); d.faq.forEach((f: any) => L.push(`### ${f.question}`, '', f.answer, '')); }
  L.push('## Order or enquire', '', `- Phone: ${BUSINESS.phone}`, `- WhatsApp: https://wa.me/${BUSINESS.whatsapp}`, `- Email: ${BUSINESS.email}`, `- Orders taken 24 hours a day, 7 days a week`, '- Delivery: Nagpur and nearby districts (within roughly 200 km — confirm on call)', '');
  return L.join('\n');
}

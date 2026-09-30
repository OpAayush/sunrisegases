export const COLLECTION_LABELS: Record<string, string> = {
  gases: 'Industrial gases',
  'gas-mixtures': 'Gas mixtures',
  'specialty-gases': 'Specialty gases',
  refrigerants: 'Refrigerants',
  cryogenic: 'Cryogenic products',
  equipment: 'Gas equipment',
  'fire-safety': 'Fire safety',
  balloons: 'Advertising balloons',
  industries: 'Industries',
};

const pkg = (d: any) => d.packaging?.map((p: any) => `${p.type}: ${p.sizes.join(', ')}`).join('; ');
const titleize = (s: string) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export function buildFacts(c: string, d: any): [string, string][] {
  if (d.keyFacts?.length) return d.keyFacts.map((k: any) => [k.label, k.value]);
  const f: [string, string | undefined][] = [];
  if (c === 'gases') {
    f.push(['Formula', d.formula], ['Grades & purity', d.grades?.map((g: any) => `${g.name} ${g.purity}`).join('; ')], ['Supply forms', d.supplyForms?.join(', ')], ['Packaging', pkg(d)], ['Hazard class', d.safety?.hazardClass]);
  } else if (c === 'gas-mixtures') {
    f.push(['Composition', d.components?.map((x: any) => `${x.gas} ${x.ratio}`).join(' + ')], ['Packaging', pkg(d)], ['Hazard class', d.safety?.hazardClass]);
  } else if (c === 'specialty-gases') {
    f.push(['Purity', d.purity], ['Certification', d.certification], ['Traceability', d.traceability]);
  } else if (c === 'refrigerants') {
    f.push(['Grade', d.grade], ['Ozone depletion potential (ODP)', String(d.odp)], ['Global warming potential (GWP)', String(d.gwp)], ['Retrofit / compatibility', d.retrofitCompatibility?.join(', ')], ['Packaging', pkg(d)], ['Hazard class', d.safety?.hazardClass]);
  } else if (c === 'cryogenic') {
    f.push(['Boil-off / sublimation', d.sublimationOrBoilOff], ['Storage & handling', d.storageAndHandling], ['Forms', d.forms?.join(', ')], ['Grade', d.grade]);
  } else if (c === 'equipment') {
    d.specs?.forEach((s: any) => f.push([s.label, s.value]));
    f.push(['Compatible with', d.compatibleWith?.join(', ')]);
  } else if (c === 'fire-safety') {
    f.push(['Extinguishing agent', d.agentType], ['Fire classes', d.fireClassRating?.join(', ')], ['Sizes', d.sizes?.join(', ')], ['Discharge time', d.dischargeTime], ['Inspection / refill', d.refillInterval]);
  } else if (c === 'balloons') {
    f.push(['Sizes', d.sizes?.join(', ')], ['Helium requirement', d.heliumRequirement], ['Customisation', d.customization?.join(', ')]);
  } else if (c === 'industries') {
    f.push(['Relevant products', d.relevantProducts?.map(titleize).join(', ')]);
  }
  f.push(['Availability', 'Open 24 hours, 7 days a week'], ['Delivery', 'Nagpur and nearby districts (within roughly 200 km — confirm on call)']);
  return f.filter(([, v]) => v && v !== 'undefined') as [string, string][];
}

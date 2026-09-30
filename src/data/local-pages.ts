export interface LocalSection {
  h2: string;
  paras?: string[];
  list?: string[];
  ordered?: boolean;
  links?: { href: string; label: string }[];
  table?: { head: string[]; rows: string[][] };
}
export interface LocalPage {
  slug: string;
  crumb: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  serviceType: string;
  sections: LocalSection[];
  faq: { q: string; a: string }[];
}

const GAS_LINKS = [
  { href: '/gases/oxygen/', label: 'Oxygen' }, { href: '/gases/nitrogen/', label: 'Nitrogen' }, { href: '/gases/argon/', label: 'Argon' },
  { href: '/gases/carbon-dioxide/', label: 'Carbon dioxide (CO2)' }, { href: '/gases/hydrogen/', label: 'Hydrogen' }, { href: '/gases/helium/', label: 'Helium' },
  { href: '/gases/dissolved-acetylene/', label: 'Dissolved acetylene' }, { href: '/gases/lpg/', label: 'Industrial LPG' },
];

export const LOCAL_PAGES: LocalPage[] = [
  {
    slug: 'gas-cylinder-refill-nagpur',
    crumb: 'Gas cylinder refill',
    title: 'Gas Cylinder Refill in Nagpur — 24×7 | Sunrise Gases',
    description: 'Industrial gas cylinder refill in Nagpur — oxygen, nitrogen, argon, CO2, hydrogen, helium, acetylene, LPG. Delivery across Nagpur. Call +91-9422416090.',
    h1: 'Gas cylinder refill in Nagpur',
    serviceType: 'Industrial gas cylinder refilling and delivery',
    lead: 'Need an industrial gas cylinder refilled in Nagpur? Sunrise Gases supplies and refills oxygen, nitrogen, argon, carbon dioxide, hydrogen, helium, dissolved acetylene and LPG cylinders, and delivers across Nagpur and nearby districts. Call or WhatsApp with the gas, cylinder size and your location — orders are taken 24 hours a day.',
    sections: [
      { h2: 'Gases available in cylinders', links: GAS_LINKS },
      { h2: 'How a refill works', ordered: true, list: [
        'Tell us the gas, cylinder size and quantity, and whether you have your own cylinder or want to exchange one.',
        'We check that the cylinder is suitable: the right gas, a valid hydrostatic test date, no dents or heavy rust, and an undamaged valve.',
        'The cylinder is refilled and transported back to you.',
      ] },
      { h2: 'Before you send a cylinder', list: [
        'Keep the valve cap on and the cylinder upright.',
        'Check the gas name on the cylinder. A cylinder must never be refilled with a different gas.',
        'Look for the test date stamped on the shoulder. Cylinders past their test date need re-testing first.',
        'Tell us if the valve leaks or is stiff.',
      ] },
      { h2: 'Refill or exchange?', paras: ['With a refill, your own cylinder is filled and returned to you. With an exchange, you hand over an empty cylinder and receive a filled one, which is quicker for regular use.'], links: [{ href: '/cylinder-rental-and-exchange-nagpur/', label: 'Cylinder rental and exchange' }, { href: '/service-area/', label: 'Delivery areas' }] },
    ],
    faq: [
      { q: 'Can you refill any gas in my cylinder?', a: 'A cylinder can only be refilled with the gas it was made and labelled for. Never ask for a different gas to be put into a cylinder.' },
      { q: 'My cylinder test date has expired. Can it be refilled?', a: 'No. A cylinder must be within its hydrostatic test date before it can be filled. Call us and we will advise on re-testing.' },
      { q: 'Which gas cylinders can I get refilled near me in Nagpur?', a: 'We supply oxygen, nitrogen, argon, carbon dioxide, hydrogen, helium, dissolved acetylene and LPG cylinders, plus mixtures such as P10 and Agroshield. Call to check availability of the size you need.' },
      { q: 'Do you deliver refilled cylinders?', a: 'Yes. Cylinders are transported to you across Nagpur and nearby districts, including Sadar. See our delivery areas page and call to confirm timing for your location.' },
      { q: 'Can I order an oxygen cylinder refill at night?', a: 'Orders are taken 24 hours a day, 7 days a week on +91-9422416090 and WhatsApp.' },
    ],
  },
  {
    slug: 'cylinder-rental-and-exchange-nagpur',
    crumb: 'Cylinder rental & exchange',
    title: 'Gas Cylinder Rental & Exchange in Nagpur | Sunrise Gases',
    description: 'Rent or exchange industrial gas cylinders in Nagpur — nitrogen, oxygen, argon, CO2 and more. Call +91-9422416090 for terms and delivery.',
    h1: 'Gas cylinder rental and exchange in Nagpur',
    serviceType: 'Industrial gas cylinder rental and exchange',
    lead: 'If you need gas only for a project or a few months, renting a cylinder can be simpler than buying one. For regular use, an exchange arrangement — return the empty, receive a filled cylinder — keeps work running without downtime. Call or WhatsApp to set up either option in Nagpur.',
    sections: [
      { h2: 'Rental or exchange: which suits you?', table: { head: ['', 'Rental', 'Exchange'], rows: [
        ['Best for', 'Short projects, trials, occasional use', 'Regular, repeat use'],
        ['How it works', 'Cylinder provided for an agreed period', 'Return the empty, receive a filled cylinder'],
        ['Tell us', 'Gas, size, duration, delivery address', 'Gas, size, quantity per cycle, delivery address'],
      ] } },
      { h2: 'Gases available', paras: ['Nitrogen, oxygen, argon, carbon dioxide, hydrogen, helium, dissolved acetylene and LPG. Call to confirm the cylinder sizes available for your gas.'], links: GAS_LINKS },
      { h2: 'What to tell us', list: ['The gas and cylinder size (Cu.M. or litres)', 'How many cylinders, and for how long or how often', 'Delivery location in or around Nagpur', 'A contact person and phone number'] },
      { h2: 'Your responsibilities as a user', list: [
        'Store cylinders upright and secured with a chain or stand.',
        'Keep the valve cap on when not in use.',
        'Never transfer gas or fill a different gas into a cylinder.',
        'Return cylinders in good condition and report any leak immediately.',
      ] },
      { h2: 'Terms', paras: ['Rental charges, deposit and return conditions depend on the gas, cylinder size and duration. Call or WhatsApp us for the current terms.'] },
    ],
    faq: [
      { q: 'Can I rent a nitrogen cylinder in Nagpur?', a: 'Cylinder rental and exchange for nitrogen and other industrial gases is available on request. Call or WhatsApp with the size and duration and we will confirm the terms.' },
      { q: 'What is the difference between refill and exchange?', a: 'A refill fills your own cylinder and returns it. An exchange swaps your empty cylinder for a filled one, which is faster for regular users.' },
      { q: 'Can I use a rented cylinder for a different gas?', a: 'No. A cylinder is dedicated to one gas and must only ever hold that gas.' },
      { q: 'How do I return a rented cylinder?', a: 'Keep the valve closed and the cap on, and call us to arrange collection or return.' },
    ],
  },
  {
    slug: 'bulk-industrial-gas-supply-nagpur',
    crumb: 'Bulk gas supply',
    title: 'Bulk Industrial Gas Supply in Nagpur | Sunrise Gases',
    description: 'Bulk nitrogen, oxygen, argon and CO2 supply in Nagpur — cylinder packs, manifold systems and liquid nitrogen for factories. Call +91-9422416090.',
    h1: 'Bulk industrial gas supply in Nagpur',
    serviceType: 'Bulk industrial gas supply',
    lead: 'Factories, fabrication units and labs that use a lot of gas need supply that does not interrupt production. Sunrise Gases supplies industrial gases in volume from Nagpur — scheduled cylinder deliveries, manifold-connected cylinder banks and liquid nitrogen — so your team spends less time changing cylinders.',
    sections: [
      { h2: 'Supply options', list: [
        'Scheduled cylinder deliveries: filled cylinders delivered and empties collected on an agreed schedule.',
        'Manifold-connected cylinder banks: several cylinders feed one line, so supply continues while empties are swapped.',
        'Liquid nitrogen: vacuum-insulated containers for cryogenic freezing, chilling and laboratories.',
        'Pre-blended mixtures such as Agroshield, Argonite and P10 in cylinders.',
      ], links: [{ href: '/equipment/industrial-gas-manifolds/', label: 'Manifold systems' }, { href: '/cryogenic/liquid-nitrogen/', label: 'Liquid nitrogen' }, { href: '/gas-mixtures/', label: 'Gas mixtures' }] },
      { h2: 'Gases commonly supplied in volume', paras: ['Nitrogen for blanketing, purging and food packaging; oxygen and dissolved acetylene for cutting; argon and carbon dioxide for welding.'], links: [{ href: '/gases/nitrogen/', label: 'Nitrogen' }, { href: '/gases/oxygen/', label: 'Oxygen' }, { href: '/gases/argon/', label: 'Argon' }, { href: '/gases/carbon-dioxide/', label: 'Carbon dioxide' }] },
      { h2: 'Who uses bulk supply', list: ['Food processing and packaging units', 'Fabrication, welding and engineering shops in MIDC and Butibori', 'Laboratories and testing facilities', 'Power, construction and maintenance contractors'], links: [{ href: '/industries/', label: 'Industries we supply' }] },
      { h2: 'How to get a bulk quote', ordered: true, list: ['Send us the gas and your monthly usage (cylinders or Cu.M.).', 'Tell us the delivery location and how often you need supply.', 'Mention any purity or mixture requirement.', 'We recommend the most practical supply arrangement for your site.'] },
    ],
    faq: [
      { q: 'Do you supply bulk nitrogen in Nagpur?', a: 'We supply nitrogen in cylinders, including scheduled and manifold-connected supply, and liquid nitrogen. Tell us your monthly usage and we will discuss the most practical arrangement.' },
      { q: 'What is nitrogen blanketing?', a: 'Nitrogen blanketing fills the space above a liquid or product with nitrogen to keep out oxygen and moisture. It is used in tanks, food packaging and chemical storage.' },
      { q: 'Can you deliver on a fixed schedule?', a: 'Scheduled deliveries can be arranged for regular customers. Tell us the frequency and delivery location.' },
      { q: 'Who supplies compressed gases in Nagpur?', a: 'Sunrise Gases supplies industrial and specialty compressed gases from Nagpur, with delivery to nearby districts. Call +91-9422416090.' },
    ],
  },
  {
    slug: 'fire-extinguisher-refilling-nagpur',
    crumb: 'Fire extinguisher refilling',
    title: 'Fire Extinguisher Refilling in Nagpur | Sunrise Gases',
    description: 'Fire extinguisher refilling in Nagpur — ABC powder, CO2, water, foam and DCP types. Call or WhatsApp +91-9422416090 to refill or replace.',
    h1: 'Fire extinguisher refilling in Nagpur',
    serviceType: 'Fire extinguisher refilling and supply',
    lead: 'A fire extinguisher only helps if it is charged and in date. Sunrise Gases can help you refill, replace or buy ABC powder, CO2, foam, water and dry chemical powder extinguishers in Nagpur. Call or WhatsApp with your extinguisher type and capacity.',
    sections: [
      { h2: 'When should an extinguisher be refilled?', list: ['After any use — even a short discharge', 'When the pressure gauge needle is outside the green zone', 'When the service or refill due date on the label has passed', 'If the seal or safety pin is broken or missing', 'If the body is rusted or dented, or the hose or nozzle is damaged'] },
      { h2: 'Extinguisher types', links: [
        { href: '/fire-safety/abc-powder-fire-extinguishers/', label: 'ABC powder — Class A, B, C' },
        { href: '/fire-safety/co2-fire-extinguishers/', label: 'CO2 — Class B and electrical' },
        { href: '/fire-safety/foam-fire-extinguishers/', label: 'Foam — Class A, B' },
        { href: '/fire-safety/water-fire-extinguishers/', label: 'Water — Class A' },
        { href: '/fire-safety/dry-chemical-powder-extinguishers/', label: 'Dry chemical powder — Class B, C' },
      ] },
      { h2: 'What to tell us', list: ['Type of extinguisher (ABC, CO2, foam, water, DCP)', 'Capacity in kg or litres', 'Make, if known', 'Date of last refill', 'How many extinguishers'] },
      { h2: 'Good practice', paras: ['Selection, installation and maintenance of first-aid extinguishers in India follow IS 2190. Mount extinguishers where they are visible and reachable, check the gauge regularly and keep a record of refill dates.'] },
    ],
    faq: [
      { q: 'How often should a fire extinguisher be refilled?', a: 'Refill after every use, and whenever the due date on the label passes or the gauge is outside the green zone. Check your extinguisher’s label for its due date.' },
      { q: 'Which extinguisher is best for an office?', a: 'ABC powder extinguishers cover solid, liquid and gas fires and are common in offices. CO2 extinguishers suit server rooms and electrical panels. Call us and describe your premises.' },
      { q: 'Can I use a water extinguisher on an electrical fire?', a: 'No. Water conducts electricity and must not be used on electrical or flammable-liquid fires.' },
      { q: 'Do you refill fire extinguishers near me in Nagpur?', a: 'Call or WhatsApp us with the type, capacity and make of your extinguisher and we will confirm refilling or replacement.' },
    ],
  },
  {
    slug: 'helium-cylinder-for-balloons-nagpur',
    crumb: 'Helium cylinder for balloons',
    title: 'Helium Cylinder for Balloons in Nagpur | Sunrise Gases',
    description: 'How many balloons can a helium cylinder fill? Estimates for 1.5, 7 and 10 Cu.M. cylinders, plus tips for events in Nagpur. Call +91-9422416090.',
    h1: 'How many balloons can a helium cylinder fill?',
    serviceType: 'Helium cylinders for balloons',
    lead: 'A 7 Cu.M. helium cylinder fills roughly 400–480 standard 11–12 inch latex balloons, a 1.5 Cu.M. cylinder around 90–100, and a 10 Cu.M. cylinder around 600–700. These are estimates: the real number depends on balloon size, fill level and how much gas is left in the cylinder.',
    sections: [
      { h2: 'Approximate latex balloons per cylinder', paras: ['Based on about 14 litres (0.5 cubic foot) of helium for an 11–12 inch latex balloon.'], table: { head: ['Cylinder', 'Helium volume', 'Balloons (11–12 inch latex)'], rows: [['Small', '1.5 Cu.M.', 'about 90–100'], ['Medium', '7 Cu.M.', 'about 400–480'], ['Large', '10 Cu.M.', 'about 600–700']] } },
      { h2: 'Larger and advertising balloons', paras: ['Large printed balloons take far more helium than party balloons. The helium requirement for each size is listed on the advertising balloons page.'], links: [{ href: '/balloons/advertising-balloons/', label: 'Advertising balloons' }, { href: '/gases/helium/', label: 'Helium cylinders' }] },
      { h2: 'Lifting capacity', paras: ['One cubic metre of helium lifts roughly 1 kg at sea level, so a 7 Cu.M. cylinder can lift about 7 kg in total, before the weight of the balloons and ribbon.'] },
      { h2: 'Tips for events in Nagpur', list: ['Fill on the day of the event; helium escapes from latex within hours.', 'Keep balloons out of strong wind, direct heat and away from power lines.', 'Never inhale helium from balloons or cylinders.', 'Tell us the balloon count and size and we will suggest the cylinder.'] },
    ],
    faq: [
      { q: 'How much helium do I need for 100 balloons?', a: 'For 100 latex balloons of 11–12 inches you need roughly 1,400 litres (1.4 Cu.M.). A 1.5 Cu.M. cylinder is only just enough, so choose a 7 Cu.M. cylinder for a safety margin.' },
      { q: 'How long do helium balloons float?', a: 'Untreated latex balloons typically float for around 8–12 hours. Foil balloons and treated latex last longer.' },
      { q: 'Is helium safe to inhale?', a: 'No. Helium displaces oxygen and can cause suffocation. Never inhale it from a balloon or cylinder.' },
      { q: 'Where can I buy helium cylinders in Nagpur?', a: 'Sunrise Gases supplies 1.5, 7 and 10 Cu.M. helium cylinders with delivery across Nagpur. Call +91-9422416090.' },
    ],
  },
];

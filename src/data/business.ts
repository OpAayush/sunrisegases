export const CONTENT_UPDATED = '2026-09-30';

export interface Branch {
  slug: string;
  name: string;
  role: string;
  blurb: string;
  open24: boolean;
  streetAddress: string;
  postalCode: string;
  mapUrl: string;
  embedUrl: string;
  geo: { lat: number; lng: number } | null;
}

export const BUSINESS = {
  name: 'Sunrise Gases',
  url: 'https://sunrisegases.com',
  phone: '+91-9422416090',
  phoneTel: '+919422416090',
  whatsapp: '919422416090',
  email: 'contact@sunrisegases.com',
  founded: '2013',
  hoursText: 'Open 24 hours, 7 days a week',
  // Google Business Profile CID (decimal). Verify against the real profile.
  gbpCid: '5443013244051232339',
  branches: [
    {
      slug: 'sadar',
      name: 'Sadar Office',
      role: 'Registered office',
      blurb: 'Our registered office in Sadar handles enquiries, orders and billing. Cylinders are transported to Sadar as well, with deliveries across Nagpur dispatched from our MIDC Hingna Road godown.',
      open24: false, // TODO: set true only if the Sadar office is really open 24 hours
      streetAddress: 'Meghraj Chawl, 212A, Gandhi Chowk, Sadar',
      postalCode: '440001',
      mapUrl: 'https://maps.app.goo.gl/pmto13xLtkvdeTrn9',
      embedUrl: 'https://www.google.com/maps?q=21.161765,79.077713&z=15&output=embed',
      geo: { lat: 21.161765, lng: 79.077713 },
    },
    {
      slug: 'hingna-midc',
      name: 'MIDC Hingna Road Office & Godown',
      role: 'Office, godown and dispatch',
      blurb: 'Our operating base: office, godown and cylinder dispatch. Deliveries across Nagpur and nearby districts go out from here.',
      open24: true,
      streetAddress: 'Sharma Engineering Works, W52, near Digdoh Gram Panchayat, MIDC, Hingna Road',
      postalCode: '440016',
      mapUrl: 'https://www.google.com/maps?q=21.1154769,79.0007651&z=17&hl=en',
      embedUrl: 'https://www.google.com/maps?q=21.1154769,79.0007651&z=15&output=embed',
      geo: { lat: 21.1154769, lng: 79.0007651 },
    },
  ] as Branch[],
  serviceCore: ['Nagpur city', 'Sadar', 'Hingna', 'MIDC Hingna Road', 'Kamptee', 'Kalmeshwar', 'Butibori', 'Wadi', 'Koradi', 'Mauda', 'Katol', 'Saoner', 'Ramtek', 'Umred', 'Narkhed'],
  serviceExtended: ['Wardha', 'Bhandara', 'Gondia', 'Chandrapur', 'Amravati', 'Yavatmal', 'Chhindwara'],
};

export const telLink = `tel:${BUSINESS.phoneTel}`;
export const mailtoLink = (subject: string, body = '') => `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}${body ? '&body=' + encodeURIComponent(body) : ''}`;
export const waLink = (text: string) => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function businessGraph() {
  const { url, name, phone, email, founded } = BUSINESS;
  const orgId = `${url}/#organization`;
  const hours = [{ '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS, opens: '00:00', closes: '23:59' }];
  const areas = [...BUSINESS.serviceCore, ...BUSINESS.serviceExtended].map((n) => ({ '@type': 'City', name: n }));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${url}/#website`, url, name, inLanguage: 'en-IN', publisher: { '@id': orgId } },
      {
        '@type': 'Organization',
        '@id': orgId,
        name,
        url,
        logo: `${url}/android-chrome-512x512.png`,
        email,
        telephone: phone,
        foundingDate: founded,
        description: 'Industrial and specialty gas manufacturer and supplier in Nagpur, Maharashtra. Registered office in Sadar; office, godown and dispatch on MIDC Hingna Road. Orders taken 24 hours a day.',
        sameAs: [`https://www.google.com/maps?cid=${BUSINESS.gbpCid}`],
      },
      ...BUSINESS.branches.map((b) => ({
        '@type': 'LocalBusiness',
        '@id': `${url}/#${b.slug}`,
        name: `${name} — ${b.name}`,
        url: `${url}/locations/${b.slug}/`,
        parentOrganization: { '@id': orgId },
        telephone: phone,
        email,
        image: `${url}/og-image.png`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: b.streetAddress,
          addressLocality: 'Nagpur',
          addressRegion: 'Maharashtra',
          postalCode: b.postalCode,
          addressCountry: 'IN',
        },
        ...(b.geo ? { geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng } } : {}),
        hasMap: b.mapUrl,
        description: b.blurb,
        ...(b.open24 ? { openingHoursSpecification: hours } : {}),
        areaServed: areas,
      })),
    ],
  };
}

export const ROUTED = ['gases', 'gas-mixtures', 'specialty-gases', 'refrigerants', 'cryogenic', 'equipment', 'fire-safety', 'balloons', 'industries'] as const;
// Static pages only. Branch pages (/locations/<slug>/) are NOT listed here — they
// are derived from BUSINESS.branches in the sitemap so the two can't drift.
export const STATIC_PAGES = ['/', '/gases/', '/gas-mixtures/', '/specialty-gases/', '/refrigerants/', '/cryogenic/', '/equipment/', '/fire-safety/', '/balloons/', '/industries/', '/about/', '/quality-and-safety/', '/contact/', '/service-area/', '/locations/'];

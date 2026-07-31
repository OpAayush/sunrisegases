import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seo = z.object({
  title: z.string(),
  description: z.string(),
});

const gases = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gases' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    formula: z.string().optional(),
    summary: z.string(),
    grades: z.array(z.object({
      name: z.string(),
      purity: z.string(),
      uses: z.array(z.string()),
    })),
    supplyForms: z.array(z.string()),
    packaging: z.array(z.object({
      type: z.string(),
      sizes: z.array(z.string()),
    })),
    applications: z.array(z.string()),
    safety: z.object({ sdsUrl: z.string(), hazardClass: z.string() }),
    images: z.array(z.object({ src: image(), alt: z.string() })),
    seo,
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

const gasMixtures = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gas-mixtures' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    components: z.array(z.object({ gas: z.string(), ratio: z.string() })),
    blendRationale: z.string(),
    applications: z.array(z.string()),
    packaging: z.array(z.object({ type: z.string(), sizes: z.array(z.string()) })),
    safety: z.object({ sdsUrl: z.string().optional(), hazardClass: z.string().optional() }),
    images: z.array(z.object({ src: image(), alt: z.string() })),
    seo,
  }),
});

const specialtyGases = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/specialty-gases' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    tier: z.enum(['ultra-high-purity', 'calibration']),
    purity: z.string(),
    certification: z.string(),
    traceability: z.string(),
    applications: z.array(z.string()),
    images: z.array(z.object({ src: image(), alt: z.string() })),
    seo,
  }),
});

const refrigerants = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/refrigerants' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    grade: z.string(),
    odp: z.number(),
    gwp: z.number(),
    retrofitCompatibility: z.array(z.string()),
    packaging: z.array(z.object({ type: z.string(), sizes: z.array(z.string()) })),
    safety: z.object({ sdsUrl: z.string().optional(), hazardClass: z.string().optional() }),
    images: z.array(z.object({ src: image(), alt: z.string() })),
    seo,
  }),
});

const cryogenic = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/cryogenic' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    sublimationOrBoilOff: z.string(),
    storageAndHandling: z.string(),
    applications: z.array(z.string()),
    forms: z.array(z.string()).optional(),
    grade: z.string().optional(),
    images: z.array(z.object({ src: image(), alt: z.string() })),
    seo,
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

const equipment = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/equipment' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    category: z.string(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })),
    compatibleWith: z.array(z.string()).optional(),
    images: z.array(z.object({ src: image(), alt: z.string() })),
    seo,
  }),
});

const fireSafety = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/fire-safety' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    agentType: z.string(),
    fireClassRating: z.array(z.string()),
    sizes: z.array(z.string()),
    dischargeTime: z.string(),
    refillInterval: z.string(),
    images: z.array(z.object({ src: image(), alt: z.string() })),
    seo,
  }),
});

const balloons = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/balloons' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    name: z.string(),
    summary: z.string(),
    sizes: z.array(z.string()),
    customization: z.array(z.string()).optional(),
    heliumRequirement: z.string().optional(),
    applications: z.array(z.string()).optional(),
    images: z.array(z.object({ src: image(), alt: z.string() })),
    seo,
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/industries' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    summary: z.string(),
    relevantProducts: z.array(z.string()),
    seo,
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/site' }),
  schema: z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('nav'),
      links: z.array(z.object({
        label: z.string(),
        href: z.string(),
        icon: z.string().optional(),
      })),
    }),
    z.object({
      kind: z.literal('footer'),
      description: z.string(),
      location: z.string(),
      established: z.string(),
    }),
    z.object({
      kind: z.literal('seo-defaults'),
      titleSuffix: z.string(),
      defaultDescription: z.string(),
      siteUrl: z.string(),
    }),
    z.object({
      kind: z.literal('products-catalog'),
      items: z.array(z.object({
        name: z.string(),
        category: z.string(),
        description: z.string(),
        finalLink: z.string(),
      })),
    }),
  ]),
});

export const collections = {
  gases,
  'gas-mixtures': gasMixtures,
  'specialty-gases': specialtyGases,
  refrigerants,
  cryogenic,
  equipment,
  'fire-safety': fireSafety,
  balloons,
  industries,
  site,
};

import { defineCollection, z } from 'astro:content';

const library = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    articleSlug: z.string(),
    title: z.string(),
    question: z.string(),
    status: z.enum(['drafting', 'published', 'archived']),
    confidence: z.enum(['low', 'moderate', 'high', 'mixed']),
    sources: z.number(),
    updated: z.string(),
    tier: z.number().optional(),
    depends_on: z.array(z.string()).optional(),
    supports: z.array(z.string()).optional(),
    hypotheses: z.array(z.object({
      id: z.string(),
      claim: z.string(),
      confidence: z.enum(['low', 'moderate', 'high', 'unknown'])
    })).optional()
  })
});

export const collections = { library };

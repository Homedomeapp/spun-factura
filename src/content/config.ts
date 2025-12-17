import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    updatedDate: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    readingTime: z.number().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };

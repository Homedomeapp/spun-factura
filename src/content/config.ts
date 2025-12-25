import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    updatedDate: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    readingTime: z.number().optional(),
    // CRÍTICO: Estos campos DEBEN estar en el schema para que Astro los pase
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

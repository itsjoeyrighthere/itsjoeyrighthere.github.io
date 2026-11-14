import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
    schema: z.object({
      title: z.string(),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      kind: z.enum(['writing', 'project', 'note']).default('writing'),
      description: z.string().default(''),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      category: z.string().nullable().optional(),
      image: z.string().default(''),
      imageAlt: z.string().default(''),
      lang: z.string().default('zh-CN'),
      external: z.url({ protocol: /^https?$/ }).optional(),
    }),
  }),
};

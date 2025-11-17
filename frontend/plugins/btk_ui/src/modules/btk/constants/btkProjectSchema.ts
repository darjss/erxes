import { z } from 'zod';

export const btkProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  logo: z.string().optional(),
});

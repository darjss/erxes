import { z } from 'zod';

export const developerInfoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url().optional(),
  address: z.object({
    city: z.string().min(1),
    district: z.string().min(1),
    address: z.string().optional(),
  }),
  dateFounded: z.string().optional(),
  email: z.string().email(),
  phone: z.string().regex(/^\d+$/, 'Invalid phone number format'),
});

import { z } from 'zod';

export const unitTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  size: z.number().min(0),
  type: z.string().min(1, 'Type is required'),
  tenureType: z.string().min(1, 'Tenure type is required'),
  content: z.string().optional(),
  price: z.number(),
  prices: z
    .array(
      z.object({
        currency: z.string().min(1),
        price: z.number(),
        priceType: z.enum(['priceBySize', 'priceByUnit']),
      }),
    )
    .optional(),
  status: z.string().optional(),
  rooms: z.any().optional(),
  roomsCount: z.number().optional(),
});

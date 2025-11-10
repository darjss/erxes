import { z } from 'zod';

export const buildingSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
  coverImage: z.string().optional(),
});

export const buildingZoneSchema = z.object({
  floor: z.number(),
  size: z.number(),
  tenureType: z.string().min(1),
  usageType: z.string().min(1),
});

export const generateByFloorRangeSchema = z
  .object({
    minFloor: z.number(),
    maxFloor: z.number(),
    size: z.number().optional(),
    tenureType: z.string().min(1),
    usageType: z.string().min(1),
  })
  .refine((data) => data.minFloor < data.maxFloor, {
    message: 'Min floor must be less than max floor',
    path: ['minFloor', 'maxFloor'],
  });

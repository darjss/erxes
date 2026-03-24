import { z } from 'zod';

export const unitRowSchema = z.object({
  buildingId: z.string(),
  zoningId: z.string(),
  unitId: z.string(),
  isMain: z.boolean().optional(),
});

export const addOpptySchema = z.object({
  description: z.string().min(1, 'Description is required'),
  customerId: z.string().min(1, 'Customer is required'),
  status: z.string().min(1, 'Status is required'),
  customerSource: z.string().min(1, 'Customer source is required'),
  assignedUserId: z.string().optional(),
  unitRows: z.array(unitRowSchema).default([]),
  labelIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  startDate: z.date().optional(),
  targetDate: z.date().optional(),
});

export type TAddOppty = z.infer<typeof addOpptySchema>;

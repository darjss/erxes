import { z } from 'zod';

export const contractSchema = z.object({
  unit: z.string().min(1, 'Unit is required'),
  number: z.string().optional(),
  currency: z.string().optional(),
  date: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive').optional(),
  amountType: z.enum(['perSize', 'perUnit']).optional(),
  status: z.enum(['draft', 'signed', 'completed', 'cancelled']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isLifeTime: z.boolean().optional(),
  party: z
    .object({
      type: z.enum(['customer', 'company']),
      id: z.string().min(1, 'Party ID is required'),
    })
    .optional(),
  paymentPlan: z
    .object({
      type: z.string().min(1, 'Payment plan type is required'),
      downPaymentPercentage: z.number().min(0).max(100).optional(),
      interestPercentage: z.number().min(0).optional(),
      interestType: z.enum(['SIMPLE', 'FLAT', 'REDUCING']).optional(),
      advancePaymentPercentage: z.number().min(0).max(100).optional(),
      discountPercentage: z.number().min(0).max(100).optional(),
      description: z.string().optional(),
      installment: z.number().min(0).optional(),
      frequency: z.string().optional(),
      penaltyPercentage: z.number().min(0).optional(),
      vatIncluded: z.boolean().optional(),
      paymentDates: z.array(z.number()).optional(),
    })
    .optional(),
  // user: z.string().optional(),s
});

export type ContractFormData = z.infer<typeof contractSchema>;

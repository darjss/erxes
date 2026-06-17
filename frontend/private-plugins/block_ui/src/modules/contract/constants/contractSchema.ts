import { z } from 'zod';

export const contractSchema = z.object({
  unit: z.string().min(1, 'Unit is required'),
  number: z.string().optional(),
  currency: z.string().optional(),
  date: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive').optional(),
  status: z.string().optional(),
  user: z.string().optional(),
  party: z
    .object({
      type: z.enum(['customer', 'company']),
      id: z.string().optional(),
    })
    .optional(),
  paymentPlan: z
    .object({
      type: z.string().optional(),
      downPaymentPercentage: z.number().min(0).max(100).optional(),
      downPaymentAmount: z.number().min(0).optional(),
      barterPercentage: z.number().min(0).max(100).optional(),
      barterAmount: z.number().min(0).optional(),
      interestPercentage: z.number().min(0).optional(),
      interestType: z.enum(['SIMPLE', 'FLAT', 'REDUCING']).optional(),
      completionPaymentPercentage: z.number().min(0).max(100).optional(),
      completionPaymentAmount: z.number().min(0).optional(),
      discountPercentage: z.number().min(0).max(100).optional(),
      description: z.string().optional(),
      installment: z.number().min(0).optional(),
      frequency: z.string().optional(),
      penaltyPercentage: z.number().min(0).optional(),
      vatIncluded: z.boolean().optional(),
      roundedInstallmentAmount: z.number().min(0).optional(),
      paymentDates: z.array(z.number()).optional(),
      paymentDueDates: z.array(z.string()).optional(),
      firstPaymentDate: z.string().optional(),
      downPaymentDate: z.string().optional(),
      completionPaymentDate: z.string().optional(),
      completionPaymentDateLabel: z.string().optional(),
    })
    .optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;

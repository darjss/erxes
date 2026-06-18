import { z } from 'zod';

export const offerSchema = z.object({
  priceId: z.string().optional(),
  price: z.object({
    currency: z.string().min(1, 'Currency is required'),
    price: z.number().min(0),
    priceType: z.enum(['priceBySize', 'priceByUnit']).optional(),
  }),
  paymentPlanId: z.string().optional(),
  paymentPlan: z
    .object({
      type: z.string().optional(),
      downPaymentPercentage: z.number().optional(),
      downPaymentAmount: z.number().optional(),
      interestPercentage: z.number().optional(),
      interestType: z.string().optional(),
      discountPercentage: z.number().optional(),
      installment: z.number().optional(),
      frequency: z.string().optional(),
      penaltyPercentage: z.number().optional(),
      barterPercentage: z.number().optional(),
      barterAmount: z.number().optional(),
      completionPaymentPercentage: z.number().optional(),
      completionPaymentAmount: z.number().optional(),
      roundedInstallmentAmount: z.number().optional(),
      paymentDates: z.array(z.number()).optional(),
      firstPaymentDate: z.string().optional(),
      downPaymentDate: z.string().optional(),
      vatIncluded: z.boolean().optional(),
    })
    .optional(),
  endDate: z.date().optional(),
  partyType: z.enum(['customer', 'company']),
  partyId: z.string().min(1, 'Customer or company is required'),
  user: z.string().min(1, 'User is required'),
});

export type OfferFormData = z.infer<typeof offerSchema>;

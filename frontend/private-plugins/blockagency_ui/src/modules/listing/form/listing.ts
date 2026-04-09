import { CurrencyCode } from 'erxes-ui';
import { z } from 'zod';
import {
  LISTING_TYPES,
  PRICING_TYPE,
  STATUS_TYPES,
} from '../constants/listing';

export const locationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  subDistrict: z.string(),
  short: z
    .string()
    .max(300, 'Cannot exceed maximum 300 characters')
    .optional(),
  lat: z.number(),
  lng: z.number(),
});

export const specsSchema = z.object({
  area: z.number(),
  floor: z.number().optional(),
  totalFloors: z.number().optional(),
  rooms: z.number().optional(),
  builtYear: z.string().optional(),
});

export const pricingSchema = z.object({
  amount: z.number(),
  currency: z
    .nativeEnum(CurrencyCode)
    .default('MNT' as CurrencyCode)
    .optional(),
  priceType: z.enum(PRICING_TYPE).optional(),
});

export const listingSchema = z.object({
  title: z.string(),
  type: z.enum(LISTING_TYPES),
  propertyType: z.string(),
  status: z.enum(STATUS_TYPES),
  description: z.string(),
  location: locationSchema,
  pricing: pricingSchema,
  specs: specsSchema,
  mediaAttachments: z.string().array().optional().nullable(),
  featuredImg: z.string().optional().nullable(),
  memberId: z.string().optional(),
});

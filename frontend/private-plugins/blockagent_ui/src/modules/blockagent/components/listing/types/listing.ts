import { z } from 'zod';
import {
  listingSchema,
  locationSchema,
  pricingSchema,
  specsSchema,
} from '../form/listing';

export interface IListingInline {
  _id: string;
  title: string;
  type: 'sale' | 'rent' | 'lease';
  propertyType: string;
  pricing?: IListingPricing;
  status: 'active' | 'inactive' | 'sold' | 'draft';
  viewCount?: number;
  createdAt?: string;
}

export type IListingLocation = z.infer<typeof locationSchema>;

export type IListingSpecs = z.infer<typeof specsSchema>;

export type IListingPricing = z.infer<typeof pricingSchema>;

export type IListing = z.infer<typeof listingSchema>;

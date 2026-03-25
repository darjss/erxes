import { Document } from 'mongoose';

export interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface IBlockListingLocation {
  city: string;
  district: string;
  subDistrict: string;
  short?: string;
  geoPoint: ILocation;
}

export interface IBlockListingPricing {
  amount: number;
  currency?: string;
  priceType?: 'fixed' | 'negotiable' | 'onRequest';
}

export interface IBlockListingSpecs {
  area: number;
  floor?: number;
  totalFloors?: number;
  rooms?: number;
  builtYear?: string;
}

export interface IBlockListing {
  title: string;
  type: 'sale' | 'rent' | 'lease';
  propertyType: string;
  status: 'active' | 'inactive' | 'sold' | 'draft';
  description: string;
  location: IBlockListingLocation;
  pricing: IBlockListingPricing;
  specs: IBlockListingSpecs;
  mediaAttachments?: string[];
}

export interface IBlockListingDocument extends IBlockListing, Document<string> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

import { Document } from 'mongoose';
import { IBtk } from '~/types';

export interface INewsPrice {
  currency: string;
  priceType: string;
  price: number;
}

export interface INewsAmenity {
  category: string;
  amenities: string[];
}

export interface INews extends IBtk {
  name?: string;
  coverImage?: string;
  location?: INewsLocation;
  verificationStatus?: string;
  status?: string;
  isPublished?: boolean;
  mainPrice?: number;
  prices?: INewsPrice[];
  bankPartners?: string[];
  newsAmenities?: INewsAmenity[];
  companyId?: string;
  title?: string;
  content?: string;
  images?: string[];
  logo?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface INewsLocation {
  lat: number;
  lng: number;
  city: string;
  district: string;
  address: string;
  parcelId: string;
}

export interface INewsDocument extends INews, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INewsQueryParams {
  searchValue?: string;
  companyId?: string;
  location?: INewsLocation;
  priceMin?: number;
  priceMax?: number;
}

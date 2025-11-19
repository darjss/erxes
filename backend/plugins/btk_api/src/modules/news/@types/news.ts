import { Document } from 'mongoose';

export interface INewsPrice {
  currency: string;
  priceType: string;
  price: number;
}

export interface INewsAmenity {
  category: string;
  amenities: string[];
}

export interface INews {
  name?: string;
  coverImage?: string;
  location?: INewsLocation;
  companyId?: string;
  verificationStatus?: string;
  content?: string;
  title?: string;
  status?: string;
  isPublished?: boolean;
  mainPrice?: number;
  prices?: INewsPrice[];
  bankPartners?: string[];
  newsAmenities?: INewsAmenity[];

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

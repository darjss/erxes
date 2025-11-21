import { Document } from 'mongoose';

export interface INewsAmenity {
  category: string;
  amenities: string[];
}

export interface INews {
  name?: string;
  coverImage?: string;
  companyId?: string;
  images?: string[];
  logo?: string;
  location?: INewsLocation;
  verificationStatus?: string;
  content?: string;
  title?: string;
  status?: string;
  isPublished?: boolean;

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

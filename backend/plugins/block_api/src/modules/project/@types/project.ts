import { Document } from 'mongoose';

export interface IProjectPrice {
  currency: string;
  priceType: string;
  price: number;
}

export interface IProjectAmenity {
  category: string;
  amenities: string[];
}

export interface IProject {
  name?: string;
  coverImage?: string;
  location?: IProjectLocation;
  status?: string;
  isPublished?: boolean;
  mainPrice?: number;
  prices?: IProjectPrice[];
  bankPartners?: string[];
  projectAmenities?: IProjectAmenity[];
}

export interface IProjectLocation {
  lat: number;
  lng: number;
  city: string;
  district: string;
  address: string;
  parcelId: string;
}

export interface IProjectDocument extends IProject, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

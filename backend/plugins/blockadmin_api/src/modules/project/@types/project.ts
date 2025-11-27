import { Document } from 'mongoose';
import { IBlock } from '~/types';

export interface IProjectPrice {
  currency: string;
  priceType: string;
  price: number;
}

export interface IProjectAmenity {
  category: string;
  amenities: string[];
}

export interface IProject extends IBlock {
  name?: string;
  coverImage?: string;
  location?: IProjectLocation;
  verificationStatus?: string;
  status?: string;
  isPublished?: boolean;
  mainPrice?: number;
  prices?: IProjectPrice[];
  bankPartners?: string[];
  projectAmenities?: IProjectAmenity[];

  startDate?: Date;
  endDate?: Date;

  counts?: {
    buildings: number;
    units: number;
    zones: number;
    parking: number;
  };
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

export interface IProjectQueryParams {
  searchValue?: string;
  developerId?: string;
  location?: IProjectLocation;
  priceMin?: number;
  priceMax?: number;
  isPublished?: boolean;
}

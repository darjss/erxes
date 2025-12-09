import { Document } from 'mongoose';

export enum ProviderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface ILocation {
  address: string;
  city: string;
  district?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IContactInfo {
  phone: string;
  email: string;
  website?: string;
}

export interface IProvider {
  businessName: string;
  description?: string;
  location: ILocation;
  contactInfo: IContactInfo;
  facilities?: string[];
  categoryIds: string[];
  status: ProviderStatus;
  rejectionReason?: string;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedBy?: string;
  isActive?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IProviderDocument extends Document, IProvider {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}


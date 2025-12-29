import { Document } from 'mongoose';

export enum ProviderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IMultilingualString {
  en: string;
  mn: string;
}

export interface IMultilingualStringOptional {
  en?: string;
  mn?: string;
}

export interface ILocation {
  address: IMultilingualString;
  city: IMultilingualString;
  district?: IMultilingualStringOptional;
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
  businessName: IMultilingualString;
  description?: IMultilingualStringOptional;
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
  instanceId?: string;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IProviderDocument extends Document, IProvider {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

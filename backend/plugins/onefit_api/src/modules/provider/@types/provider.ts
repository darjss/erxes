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
  icon?: string;
  coverImages?: string[];
  instanceId?: string;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IProviderDocument extends Document, IProvider {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ICity {
  _id: string;
  name: IMultilingualString;
  code?: string;
  isActive?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface ICityDocument extends Document, ICity {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IDistrict {
  _id: string;
  cityId: string;
  name: IMultilingualString;
  code?: string;
  isActive?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IDistrictDocument extends Document, IDistrict {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

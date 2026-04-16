import { Document } from 'mongoose';

export enum BannerType {
  ADULT = 'adult',
  CHILD = 'child',
}

export enum BannerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface IBanner {
  image: string;
  providerId: string;
  type: BannerType;
  status: BannerStatus;
  instanceId?: string;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IBannerDocument extends Document, IBanner {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

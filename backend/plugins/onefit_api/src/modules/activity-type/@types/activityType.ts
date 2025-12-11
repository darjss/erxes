import { Document } from 'mongoose';

export enum GenderRestriction {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed',
}

export interface IMultilingualString {
  en: string;
  mn: string;
}

export interface IMultilingualStringOptional {
  en?: string;
  mn?: string;
}

export interface IActivityType {
  providerId: string;
  name: IMultilingualString;
  description?: IMultilingualStringOptional;
  creditCost: number; // Credit points required
  duration: number; // Duration in minutes
  genderRestriction: GenderRestriction;
  categoryIds: string[]; // Activity category IDs (Kids/Adults)
  isActive: boolean;
  cancellationDeadline?: number; // Hours before activity start when cancellation is allowed
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IActivityTypeDocument extends Document, IActivityType {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

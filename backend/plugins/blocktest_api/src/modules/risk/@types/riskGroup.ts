import { Document } from 'mongoose';

export interface ICVRiskGroup {
  name: string;
  client: string;
  effective_date: Date;
  expiration_date: Date;
}

export interface ICVRiskGroupDocument extends ICVRiskGroup, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICVRiskGroupFilter {
  name?: string;
  client?: string;
  effective_date?: Date;
  expiration_date?: Date;
}

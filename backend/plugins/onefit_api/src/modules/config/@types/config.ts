import { Document } from 'mongoose';

export interface ISystemConfig {
  key: string;
  value: any;
  description?: string;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface ISystemConfigDocument extends Document, ISystemConfig {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}


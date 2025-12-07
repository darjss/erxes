import { Document } from 'mongoose';

export interface ICVCLient {
  name?: string;
}

export interface ICVClientDocument extends ICVCLient, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

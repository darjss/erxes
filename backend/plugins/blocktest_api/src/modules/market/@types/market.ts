import { Document } from 'mongoose';

export interface ICVCLient {
  name?: string;
}

export interface ICVMarketDocument extends ICVCLient, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

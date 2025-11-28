import { Document } from 'mongoose';

export interface IBlocktest {
  name?: string;
}

export interface IBlocktestDocument extends IBlocktest, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

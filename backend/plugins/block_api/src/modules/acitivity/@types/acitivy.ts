import { Document } from 'mongoose';

interface IBlockActivityMetaData {
  newValue?: string;
  previousValue?: string;
}

export interface IBlockActivity {
  action: string;
  itemId: string;
  itemType: string;
  module: string;
  metadata: IBlockActivityMetaData;
  createdBy: string;
}

export interface IBlockActivityUpdate extends IBlockActivity {
  _id: string;
}

export interface IBlockActivityDocument extends IBlockActivity, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

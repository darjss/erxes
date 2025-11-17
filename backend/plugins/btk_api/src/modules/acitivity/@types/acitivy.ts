import { Document } from 'mongoose';

interface IBtkActivityMetaData {
  newValue?: string;
  previousValue?: string;
}

export interface IBtkActivity {
  action: string;
  itemId: string;
  itemType: string;
  module: string;
  metadata: IBtkActivityMetaData;
  createdBy: string;
}

export interface IBtkActivityUpdate extends IBtkActivity {
  _id: string;
}

export interface IBtkActivityDocument extends IBtkActivity, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

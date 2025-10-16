import { IAddress } from 'erxes-api-shared/core-types';
import { Document } from 'mongoose';

export interface IBlockDeveloper {
  name: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: IAddress;
  dateFounded: Date;
}

export interface IBlockDeveloperDocument extends IBlockDeveloper, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

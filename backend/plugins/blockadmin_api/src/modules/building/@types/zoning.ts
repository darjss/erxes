import { Document } from 'mongoose';
import { IBlock } from '~/types';

export interface IZoning extends IBlock {
  building: string;
  floor: number;
  usageType: string;
  tenureType: string;
  size: number;
}

export interface IZoningDocument extends IZoning, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

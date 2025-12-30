import { Document } from 'mongoose';
import { IBlock } from '~/types';

export interface IUnit extends IBlock {
  zoning: string;
  number: string;
  status: string;

  type: string;
  isFeatured: boolean;
}

export interface IUnitInput extends IUnit {
  useProjectPrice: boolean;
}

export interface IUnitDocument extends IUnit, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

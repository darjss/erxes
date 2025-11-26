import { Document } from 'mongoose';
import { IBlock } from '~/types';
import { IUnitLead } from './unitLead';

export interface IUnit extends IBlock {
  building: string;
  zoning: string;
  number: string;
  status: string;

  leads: IUnitLead[];

  type: string;
}

export interface IUnitInput extends IUnit {
  useProjectPrice: boolean;
}

export interface IUnitDocument extends IUnit, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

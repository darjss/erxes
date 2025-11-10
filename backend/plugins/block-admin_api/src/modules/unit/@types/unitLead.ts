import { Document } from 'mongoose';
import { IBlock } from '~/types';

export interface IUnitLead extends IBlock {
  leadType: string;
  leadId: string;
  unit: string;
}

export interface IUnitLeadDocument extends IUnitLead, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

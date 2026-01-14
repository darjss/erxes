import { OPPTY_STATUSES } from '@/oppty/constants';
import { Document } from 'mongoose';

export enum FIELD {
  STATUS = 'STATUS',
  ASSIGNEE = 'ASSIGNEE',

  CUSTOMER = 'CUSTOMER',
  CUSTOMER_SOURCE = 'CUSTOMER_SOURCE',

  PROJECT = 'PROJECT',
  BLOCK = 'BLOCK',

  UNIT_TYPE = 'UNIT_TYPE',
  UNIT = 'UNIT',

  LABEL = 'LABEL',
  TAG = 'TAG',

  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
}

export interface IOppty {
  number: string;
  description: string;
  customerId: string;
  unitTypes?: string[];
  units?: string[];
  assignedUserId?: string;
  blocks?: string[];
  status: (typeof OPPTY_STATUSES)[keyof typeof OPPTY_STATUSES];
  labelIds?: string[];
  tagIds?: string[];
  projectId?: string;
  startDate?: Date;
  targetDate?: Date;
  customerSource?: string;
}

export interface IOpptyFilter {
  number?: string;
  description?: string;
  customerId?: string;
  unitType?: string;
  unit?: string;
  assignedUserId?: string;
  status?: (typeof OPPTY_STATUSES)[keyof typeof OPPTY_STATUSES];
  startDate?: Date;
  targetDate?: Date;
  customerSource?: string;
  labelId?: string;
  tagId?: string;
}

export interface IOpptyDocument extends IOppty, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

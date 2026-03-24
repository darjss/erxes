import { OPPTY_STATUSES } from '@/oppty/constants';
import { IPropertyField } from 'erxes-api-shared/core-types';
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

export interface IPropertyRow {
  buildingId?: string;
  zoningId?: string;
  unitId?: string;
  isMain?: boolean;
}

export interface IOppty {
  number: string;
  description: string;
  customerId: string;
  unitTypes?: string[];
  units?: string[];
  unit?: string;
  propertyRows?: IPropertyRow[];
  assignedUserId?: string;
  blocks?: string[];
  status: string;
  labelIds?: string[];
  tagIds?: string[];
  projectId?: string;
  startDate?: Date;
  targetDate?: Date;
  customerSource?: string;
  propertiesData?: IPropertyField;
}

export interface IOpptyFilter {
  searchValue?: string;
  number?: string;
  description?: string;
  customerId?: string;
  unitType?: string;
  unit?: string;
  assignedUserId?: string;
  status?: string;
  priority?: string;
  startDate?: Date;
  targetDate?: Date;
  dateFilters?: string;
  customerSource?: string;
  labelId?: string;
  tagId?: string;
}

export interface IOpptyDocument extends IOppty, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOpptyInput {
  description: string;
  customerId: string;
  unitTypes?: string[];
  units?: string[];
  unit?: string;
  propertyRows?: IPropertyRow[];
  assignedUserId?: string;
  blocks?: string[];
  status: string;
  labelIds?: string[];
  tagIds?: string[];
  projectId?: string;
  startDate?: Date;
  targetDate?: Date;
  customerSource?: string;
  propertiesData?: IPropertyField;
}

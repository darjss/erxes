import { IProjectPrice } from '@/project/types/projectTypes';

export interface IUnit {
  _id: string;
  number: string;
  type: IUnitType;
  zoning: string;
  building: string;
  status: string;
}

export interface IUnitType {
  _id: string;
  size: number;
  type: string;
  tenureType: string;
  price: number;
  prices: IProjectPrice[];
}

export interface IUnitAttachment {
  _id?: string;
  attachment?: string;
}

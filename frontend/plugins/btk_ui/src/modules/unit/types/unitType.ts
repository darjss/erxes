import { IProjectPrice } from '@/project/types/projectTypes';

export interface IUnit {
  _id: string;
  number: string;
  size: number;
  type: string;
  tenureType: string;
  zoning: string;
  mainPrice: number;
  prices: IProjectPrice[];
  building: string;
  status: string;
}

export interface IUnitAttachment {
  _id?: string;
  attachment?: string;
}

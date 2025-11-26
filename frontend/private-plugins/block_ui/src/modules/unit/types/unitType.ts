import { IProjectPrice } from '@/project/types/projectTypes';

export interface IUnit {
  _id: string;
  number: string;
  type: IUnitType;
  zoning: string;
  building: string;
  status: string;
}

export interface IUnitRoom {
  type: string;
  count: number;
}

export interface IUnitType {
  _id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  tenureType: string;
  content: string;
  price: number;
  prices: IProjectPrice[];
  status: string;
  rooms: IUnitRoom[];
  roomsCount: number;
  project: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUnitAttachment {
  _id?: string;
  attachment?: string;
}

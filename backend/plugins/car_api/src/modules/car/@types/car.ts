import { Document } from 'mongoose';

export interface ICar {
  name?: string;
}

export interface ICarDocument extends ICar, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

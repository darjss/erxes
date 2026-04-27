import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ICarDocument } from '@/car/@types/car';

import mongoose from 'mongoose';

import { loadCarClass, ICarModel } from '@/car/db/models/Car';

export interface IModels {
  Car: ICarModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Car = db.model<ICarDocument, ICarModel>(
    'car',
    loadCarClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);

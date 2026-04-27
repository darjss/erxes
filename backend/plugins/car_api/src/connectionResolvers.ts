import { ScopedEventHandlers } from 'erxes-api-shared/core-modules';
import { IMainContext } from 'erxes-api-shared/core-types';
import { createGenerateModels } from 'erxes-api-shared/utils';
import mongoose from 'mongoose';
import { ICarCategoryDocument, ICarDocument } from '@/car/@types/car';
import {
  ICarCategoryModel,
  loadCarCategoryClass,
} from '@/car/db/models/CarCategories';
import { ICarModel, loadCarClass } from '@/car/db/models/Cars';
import { ILoaders } from '@/car/graphql/resolvers/loaders';

export interface IModels {
  Cars: ICarModel;
  CarCategories: ICarCategoryModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
  loaders: ILoaders;
  commonQuerySelector?: Record<string, any>;
  commonQuerySelectorElk?: any;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
  eventHandlers: ScopedEventHandlers,
): IModels => {
  const models = {} as IModels;
  const carEventHandlers = eventHandlers('car');

  models.Cars = db.model<ICarDocument, ICarModel>(
    'cars',
    loadCarClass(models, subdomain, carEventHandlers('car', 'cars')),
  );

  models.CarCategories = db.model<ICarCategoryDocument, ICarCategoryModel>(
    'car_categories',
    loadCarCategoryClass(
      models,
      subdomain,
      carEventHandlers('car', 'carCategories'),
    ),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);

import type { IModels } from '~/connectionResolvers';
import { carLoader } from './car';
import type { IRef } from './car';

export interface ICarLoaders {
  customersByCarId: ReturnType<typeof carLoader>['customersByCarId'];
  companiesByCarId: ReturnType<typeof carLoader>['companiesByCarId'];
  categoryById: ReturnType<typeof carLoader>['categoryById'];
}

export interface ILoaders {
  car: ICarLoaders;
}

export type { IRef };

export const createLoaders = (
  subdomain: string,
  models: IModels,
): ILoaders => ({
  car: carLoader(subdomain, models),
});

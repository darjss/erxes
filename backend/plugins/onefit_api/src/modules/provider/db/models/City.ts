import { ICityDocument } from '@/provider/@types/provider';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { citySchema } from '../definitions/city';

export interface ICityModel extends Model<ICityDocument> {}

export const loadCityClass = (models: IModels) => {
  class City {}

  citySchema.loadClass(City);

  return citySchema;
};

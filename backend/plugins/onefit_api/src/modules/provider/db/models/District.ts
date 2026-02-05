import { IDistrictDocument } from '@/provider/@types/provider';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { districtSchema } from '../definitions/district';

export interface IDistrictModel extends Model<IDistrictDocument> {}

export const loadDistrictClass = (models: IModels) => {
  class District {}

  districtSchema.loadClass(District);

  return districtSchema;
};

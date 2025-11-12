import { FilterQuery } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IProjectDocument, IProjectQueryParams } from './@types/project';

export const generateFilter = async (
  params: IProjectQueryParams,
  models: IModels,
) => {
  const { searchValue, developerId, location, priceMin, priceMax } =
    params || {};

  const filter: FilterQuery<IProjectDocument> = {};

  if (searchValue) {
    filter.name = { $regex: searchValue, $options: 'i' };
  }

  if (developerId) {
    const { subdomain } =
      (await models.Developer.findOne({ _id: developerId }).lean()) || {};

    if (subdomain) {
      filter.subdomain = subdomain;
    }
  }

  if (location) {
    filter.location = location;
  }

  if (priceMin) {
    filter.priceMin = { $gte: priceMin };
  }

  if (priceMax) {
    filter.priceMax = { $lte: priceMax };
  }

  return filter;
};

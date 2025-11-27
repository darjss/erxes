import { FilterQuery } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IProjectDocument, IProjectQueryParams } from './@types/project';

export const generateFilter = async (
  params: IProjectQueryParams,
  models: IModels,
) => {
  const { isPublished, searchValue, developerId, district, priceMin, priceMax, type } =
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

  if (district) {
    filter['location.district'] = district;
  }

  if (priceMin) {
    filter.mainPrice = { $gte: priceMin };
  }

  if (priceMax) {
    filter.mainPrice = { $lte: priceMax };
  }

  if (type) {
    filter.types = type;
  }

  if (isPublished) {
    filter.isPublished = isPublished;
  }

  console.log('filter', filter)

  return filter;
};

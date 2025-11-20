import { FilterQuery } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { INewsDocument, INewsQueryParams } from './@types/news';

export const generateFilter = async (
  params: INewsQueryParams,
  models: IModels,
) => {
  const { searchValue, companyId, location, priceMin, priceMax } = params || {};

  const filter: FilterQuery<INewsDocument> = {};

  if (searchValue) {
    filter.name = { $regex: searchValue, $options: 'i' };
  }

  if (companyId) {
    const { subdomain } =
      (await models.Company.findOne({ _id: companyId }).lean()) || {};

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

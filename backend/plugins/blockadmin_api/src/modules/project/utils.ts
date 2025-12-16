import isNil from 'lodash/isNil';
import { FilterQuery } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IProjectDocument, IProjectQueryParams } from './@types/project';

export const generateFilter = async (
  params: IProjectQueryParams,
  models: IModels,
) => {
  const {
    isPublished,
    searchValue,
    developerId,
    district,
    priceMin,
    priceMax,
    type,
    types,
    status,
    dateFilters,
    locations,
    isFeatured,
  } = params || {};

  const filter: FilterQuery<IProjectDocument> = {};

  if (isFeatured) {
    filter.tierLevel = { $exists: true, $gte: 1 };
  }

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

  if (dateFilters) {
    const dateFilter = JSON.parse(dateFilters);

    for (const key in dateFilter) {
      if (dateFilter.hasOwnProperty(key)) {
        const { gte, lte } = dateFilter[key];

        if (!filter[key]) {
          filter[key] = {};
        }

        if (gte) {
          filter[key]['$gte'] = gte;
        }

        if (lte) {
          filter[key]['$lte'] = lte;
        }
      }
    }
  }

  if (types?.length) {
    filter.types = { $in: types };
  }

  if (status) {
    filter.status = status;
  }

  if (!isNil(isPublished)) {
    filter.isPublished = isPublished;
  }

  if (locations) {
    const location = JSON.parse(locations);

    if (location.city) {
      filter['location.city'] = location.city;
    }

    if (location.district) {
      filter['location.district'] = location.district;
    }
  }

  console.log('filter', filter);

  return filter;
};

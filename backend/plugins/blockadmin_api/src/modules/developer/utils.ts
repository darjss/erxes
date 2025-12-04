import { FilterQuery } from 'mongoose';
import {
  DeveloperQueryParams,
  IBlockDeveloperDocument,
} from './db/@types/developer';

export const generateFilter = async (params: DeveloperQueryParams) => {
  const { searchValue, verificationStatus, city, district, dateFilters } =
    params;

  const filter: FilterQuery<IBlockDeveloperDocument> = {};

  if (verificationStatus) {
    filter.verificationStatus = verificationStatus;
  }

  if (searchValue) {
    filter.name = { $regex: searchValue, $options: 'i' };
  }

  if (city) {
    filter['address.address.city'] = city;
  }

  if (district) {
    filter['address.address.city_district'] = district;
  }

  if (dateFilters) {
    const dateFilter = JSON.parse(dateFilters);

    for (const key in dateFilter) {
      if (key === 'dateFounded' && dateFilter.hasOwnProperty(key)) {
        const { gte, lte } = dateFilter[key];

        if (!filter[key]) {
          filter[key] = {};
        }

        if (gte) {
          filter[key]['$gte'] = new Date(gte).getFullYear();
        }

        if (lte) {
          filter[key]['$lte'] = new Date(lte).getFullYear();
        }

        continue;
      }

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

  return filter;
};

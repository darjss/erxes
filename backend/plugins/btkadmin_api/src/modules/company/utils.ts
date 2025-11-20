import { FilterQuery } from 'mongoose';
import { CompanyQueryParams, IBtkCompanyDocument } from './db/@types/company';

export const generateFilter = async (params: CompanyQueryParams) => {
  const { searchValue, isVerified, location } = params;

  const filter: FilterQuery<IBtkCompanyDocument> = {};

  if (isVerified) {
    filter.isVerified = isVerified;
  }

  if (searchValue) {
    filter.name = { $regex: searchValue, $options: 'i' };
  }

  if (location) {
    filter.address = location;
  }

  return filter;
};

import { FilterQuery } from 'mongoose';
import { CompanyQueryParams, IBtkCompanyDocument } from './db/@types/company';
import { IModels } from '~/connectionResolvers';

export const generateFilter = async (
  params: CompanyQueryParams,
  _models: IModels,
) => {
  const { searchValue, verificationStatus, location } = params;

  const filter: FilterQuery<IBtkCompanyDocument> = {};

  if (verificationStatus) {
    filter.verificationStatus = verificationStatus;
  }

  if (searchValue) {
    filter.name = { $regex: searchValue, $options: 'i' };
  }

  if (location) {
    filter.address = location;
  }

  return filter;
};

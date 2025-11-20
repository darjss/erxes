import { FilterQuery } from 'mongoose';
import {
  DeveloperQueryParams,
  IBlockDeveloperDocument,
} from './db/@types/developer';

export const generateFilter = async (params: DeveloperQueryParams) => {
  const { searchValue, verificationStatus, location } = params;

  const filter: FilterQuery<IBlockDeveloperDocument> = {};

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

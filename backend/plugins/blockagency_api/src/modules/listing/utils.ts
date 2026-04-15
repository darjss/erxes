import { FilterQuery } from 'mongoose';
import { IBlockListingDocument, ListingQueryParams } from './@types/listing';

export const generateFilter = async (params: ListingQueryParams) => {
  const { searchValue, status, city, district } = params;

  const filter: FilterQuery<IBlockListingDocument> = {};

  if (status) {
    filter.status = status;
  }

  if (searchValue) {
    filter.name = { $regex: searchValue, $options: 'i' };
  }

  if (city) {
    filter['operationArea.city'] = city;
  }

  if (district) {
    filter['operationArea.district'] = district;
  }

  return filter;
};

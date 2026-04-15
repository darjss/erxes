import { FilterQuery } from 'mongoose';
import { IBlockAdminListingDocument } from './@types/listing';

interface ListingQueryParams {
  subdomain?: string;
  status?: string;
  searchValue?: string;
  city?: string;
  district?: string;
}

export const generateFilter = (
  params: ListingQueryParams,
): FilterQuery<IBlockAdminListingDocument> => {
  const { subdomain, status, searchValue, city, district } = params;
  const filter: FilterQuery<IBlockAdminListingDocument> = {};

  if (subdomain) filter.subdomain = subdomain;
  if (status) filter.status = status;
  if (searchValue) filter.title = { $regex: searchValue, $options: 'i' };
  if (city) filter['location.city'] = city;
  if (district) filter['location.district'] = district;

  return filter;
};

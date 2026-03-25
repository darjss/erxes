import { FilterQuery } from 'mongoose';
import { AgencyQueryParams, IBlockAgencyDocument } from './@types/agency';

export const generateFilter = async (params: AgencyQueryParams) => {
  const { searchValue, verificationStatus, city, district } = params;

  const filter: FilterQuery<IBlockAgencyDocument> = {};

  if (verificationStatus) {
    filter.verificationStatus = verificationStatus;
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

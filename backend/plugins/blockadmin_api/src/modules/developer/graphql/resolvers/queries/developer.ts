import {
  DeveloperQueryParams,
  IBlockDeveloperDocument,
} from '@/developer/db/@types/developer';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext, IModels } from '~/connectionResolvers';

const generateFilter = async (params: DeveloperQueryParams, models: IModels) => {
  const { searchValue, isVerified, developerId } = params;

  const filter: FilterQuery<IBlockDeveloperDocument> = {};

  if (isVerified) {
    filter.isVerified = isVerified;
  }

  if (searchValue) {
    filter.name = { $regex: searchValue, $options: 'i' };
  }

  if (developerId) {
    const { subdomain } = await models.Developer.findOne({ _id: developerId }).lean() || {};
    
    if (!subdomain) {
      throw new Error('Developer not found');
    }
    
    filter.subdomain = subdomain;
  }

  return filter;
};

export const developerQueries = {
  getBlockAdminDevelopers: async (
    _root: undefined,
    params: DeveloperQueryParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params, models);

    return await cursorPaginate<IBlockDeveloperDocument>({
      model: models.Developer,
      params,
      query: filter,
    });
  },
  getBlockAdminDeveloperInfo: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Developer.findOne({ _id });
  },
};

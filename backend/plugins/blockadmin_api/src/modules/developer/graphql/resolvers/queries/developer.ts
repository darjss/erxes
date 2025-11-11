import {
  DeveloperQueryParams,
  IBlockDeveloperDocument,
} from '@/developer/db/@types/developer';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';

const generateFilter = (params: DeveloperQueryParams) => {
  const filter: FilterQuery<IBlockDeveloperDocument> = {};

  if (params.isVerified) {
    filter.isVerified = params.isVerified;
  }

  return filter;
};

export const developerQueries = {
  getBlockAdminDevelopers: async (
    _root: undefined,
    params: DeveloperQueryParams,
    { models }: IContext,
  ) => {
    const filter = generateFilter(params);

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

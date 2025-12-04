import {
  DeveloperQueryParams,
  IBlockDeveloperDocument,
} from '@/developer/db/@types/developer';
import { generateFilter } from '@/developer/utils';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const developerQueries = {
  getBlockAdminDevelopers: async (
    _root: undefined,
    params: DeveloperQueryParams & ICursorPaginateParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params);

    const { list, pageInfo, totalCount } =
      await cursorPaginate<IBlockDeveloperDocument>({
        model: models.Developer,
        params,
        query: filter,
      });

    return { list, pageInfo, totalCount };
  },
  getBlockAdminDeveloperInfo: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Developer.findOne({ _id }).lean();
  },
};

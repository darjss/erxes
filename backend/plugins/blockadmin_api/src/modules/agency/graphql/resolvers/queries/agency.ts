import {
  AgencyQueryParams,
  IBlockAgencyDocument,
} from '@/agency/@types/agency';
import { generateFilter } from '@/agency/utils';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const agencyQueries = {
  getBlockAdminAgencies: async (
    _root: undefined,
    params: AgencyQueryParams & ICursorPaginateParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params);

    const { list, pageInfo, totalCount } =
      await cursorPaginate<IBlockAgencyDocument>({
        model: models.Agency,
        params,
        query: filter,
      });

    return { list, pageInfo, totalCount };
  },
  getBlockAdminAgencyInfo: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Agency.findOne({ _id }).lean();
  },
};

import { IContext } from '~/connectionResolvers';
import {
  ICVRiskGroupDocument,
  ICVRiskGroupFilter,
} from '@/risk/@types/riskGroup';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { FilterQuery } from 'mongoose';
export const cvRiskGroupQueries = {
  cvGetRiskGroups: async (
    _parent: undefined,
    {
      filter = {},
      ...params
    }: { filter?: Partial<ICVRiskGroupFilter> & ICursorPaginateParams },
    { models }: IContext,
  ) => {
    const query = {} as FilterQuery<ICVRiskGroupDocument>;

    if (filter.name) {
      query.name = { $regex: filter.name, $options: 'i' };
    }

    if (filter.client) {
      query.client = filter.client;
    }

    if (filter.effective_date) {
      query.effective_date = filter.effective_date;
    }

    if (filter.expiration_date) {
      query.expiration_date = filter.expiration_date;
    }

    return cursorPaginate<ICVRiskGroupDocument>({
      model: models.CVRiskGroups,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },

      query,
    });
  },
  cvGetRiskGroup: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.CVRiskGroups.findById({ _id });
  },
};

import { IContext } from '~/connectionResolvers';
import { cursorPaginate } from 'erxes-api-shared/utils';
import {
  ICVClientFilter,
  ICVClientDocument,
} from '~/modules/client/@types/client';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { FilterQuery } from 'mongoose';

export const cvClientQueries = {
  cvGetClient: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.CVClient.cvGetClient(_id);
  },

  cvGetClients: async (
    _parent: undefined,
    {
      filter = {},
      ...params
    }: { filter?: Partial<ICVClientFilter> & ICursorPaginateParams },
    { models }: IContext,
  ) => {
    const query = {} as FilterQuery<ICVClientDocument>;

    if (filter.name) {
      query.name = { $regex: filter.name, $options: 'i' };
    }

    if (filter.client_type) {
      query.client_type = filter.client_type;
    }

    if (filter.registration_number) {
      query.registration_number = filter.registration_number;
    }

    if (filter.operational_address) {
      query.operational_address = {
        $regex: filter.operational_address,
        $options: 'i',
      };
    }

    if (filter.business_type) {
      query.business_type = filter.business_type;
    }
    if (filter.business_category) {
      query.business_category = filter.business_category;
    }

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.cvh_broker) {
      query.cvh_broker = filter.cvh_broker;
    }

    if (filter.registered_date) {
      query.registered_date = filter.registered_date;
    }

    if (filter.isActive) {
      query.isActive = filter.isActive;
    }

    return cursorPaginate<ICVClientDocument>({
      model: models.CVClient,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query,
    });
  },
};

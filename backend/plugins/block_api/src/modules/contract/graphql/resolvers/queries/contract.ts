import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContractDocument } from '@/contract/@types/contract';
import { IContext } from '~/connectionResolvers';

interface IContractFilter {
  search?: string;
  status?: string;
  partyType?: string;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
  user?: string;
}

export const contractQueries = {
  blockGetContract: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Contract.getContract(_id);
  },

  blockGetContracts: async (
    _parent: undefined,
    { unit }: { unit?: string },
    { models }: IContext,
  ) => {
    return models.Contract.find(unit ? { unit } : {});
  },

  blockGetContractsList: async (
    _parent: undefined,
    {
      filter,
      limit,
      cursor,
      direction,
    }: {
      filter?: IContractFilter;
      limit?: number;
      cursor?: string;
      direction?: 'forward' | 'backward';
    },
    { models }: IContext,
  ) => {
    const query: Record<string, any> = {};

    if (filter) {
      if (filter.search) {
        query.number = { $regex: filter.search, $options: 'i' };
      }
      if (filter.status) {
        query.status = filter.status;
      }
      if (filter.partyType) {
        query['party.type'] = filter.partyType;
      }
      if (filter.currency) {
        query.currency = filter.currency;
      }
      if (filter.user) {
        query.user = filter.user;
      }
      if (filter.dateFrom || filter.dateTo) {
        query.date = {};
        if (filter.dateFrom) {
          query.date.$gte = new Date(filter.dateFrom);
        }
        if (filter.dateTo) {
          query.date.$lte = new Date(filter.dateTo);
        }
      }
    }

    return cursorPaginate<IContractDocument>({
      model: models.Contract as any,
      params: {
        limit: limit ?? 30,
        cursor,
        direction: direction ?? 'forward',
        orderBy: { createdAt: 'desc' },
      },
      query,
    });
  },
};


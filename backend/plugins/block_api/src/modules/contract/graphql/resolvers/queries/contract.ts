import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContractDocument } from '@/contract/@types/contract';
import { IContext } from '~/connectionResolvers';

interface IContractFilter {
  projectId?: string;
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
      if (filter.projectId) {
        const buildings = await models.Building.find(
          { project: filter.projectId },
          { _id: 1 },
        ).lean();
        const buildingIds = buildings.map((b: any) => b._id);

        const zonings = await models.Zoning.find(
          { building: { $in: buildingIds } },
          { _id: 1 },
        ).lean();
        const zoningIds = zonings.map((z: any) => z._id);

        const units = await models.Unit.find(
          { zoning: { $in: zoningIds } },
          { _id: 1 },
        ).lean();
        const unitIds = units.map((u: any) => u._id);

        query.unit = { $in: unitIds };
      }
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

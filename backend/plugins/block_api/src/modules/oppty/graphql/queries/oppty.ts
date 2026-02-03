import { IContext } from '~/connectionResolvers';
import { IOpptyDocument, IOpptyFilter } from '@/oppty/@types/oppty';
import { FilterQuery } from 'mongoose';
import { cursorPaginate } from 'erxes-api-shared/utils';

export const opptyQueries = {
  blockGetOpptys: async (
    _parent: undefined,
    { projectId, filter }: { projectId: string; filter: IOpptyFilter },
    { models }: IContext,
  ) => {
    const filterQuery: FilterQuery<IOpptyDocument> = {};

    filterQuery.projectId = projectId;

    if (filter?.number) {
      filterQuery.number = filter.number;
    }

    if (filter?.description) {
      filterQuery.description = { $regex: filter.description, $options: 'i' };
    }

    if (filter?.customerId) {
      filterQuery.customerId = filter.customerId;
    }

    if (filter?.unitType) {
      filterQuery.unitTypes = { $in: [filter.unitType] };
    }

    if (filter?.unit) {
      filterQuery.units = { $in: [filter.unit] };
    }

    if (filter?.assignedUserId) {
      filterQuery.assignedUserId = filter.assignedUserId;
    }

    if (filter?.status) {
      filterQuery.status = filter.status;
    }

    if (filter?.startDate) {
      filterQuery.startDate = { $gte: filter.startDate };
    }

    if (filter?.targetDate) {
      filterQuery.targetDate = { $gte: filter.targetDate };
    }

    if (filter?.customerSource) {
      filterQuery.customerSource = filter.customerSource;
    }

    if (filter?.labelId) {
      filterQuery.labelIds = { $in: [filter.labelId] };
    }

    if (filter?.tagId) {
      filterQuery.tagIds = { $in: [filter.tagId] };
    }

    const { list, pageInfo, totalCount } = await cursorPaginate<IOpptyDocument>(
      {
        model: models.Oppty,
        params: {
          ...(filter || {}),
          orderBy: {
            updatedAt: 'desc',
          },
        },
        query: filterQuery,
      },
    );

    return { list, pageInfo, totalCount };
  },
};

import { IContext } from '~/connectionResolvers';
import { IOpptyDocument, IOpptyFilter } from '@/oppty/@types/oppty';
import { FilterQuery, Types } from 'mongoose';
import { cursorPaginate } from 'erxes-api-shared/utils';

export const opptyQueries = {
  blockGetOppty: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Oppty.getOppty(_id);
  },

  blockGetOpptyUnitRows: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const oppty = await models.Oppty.getOppty(_id);

    return oppty.propertyRows || [];
  },

  blockGetOpptys: async (
    _parent: undefined,
    { projectId, filter }: { projectId: string; filter: IOpptyFilter },
    { models }: IContext,
  ) => {
    const filterQuery: FilterQuery<IOpptyDocument> = {};

    filterQuery.projectId = projectId;

    if (filter?.searchValue) {
      const searchRegex = { $regex: filter.searchValue, $options: 'i' };

      filterQuery.$or = [
        { number: searchRegex },
        { description: searchRegex },
      ];
    }

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
      filterQuery.unitType = filter.unitType;
    }

    if (filter?.tenureType) {
      const [areaType, ...tenureTypes] = filter.tenureType.split(':');

      if (tenureTypes.length) {
        filterQuery.$and = [
          ...(filterQuery.$and || []),
          { tenureType: { $regex: `^${areaType}:` } },
          ...tenureTypes.map((t) => ({
            tenureType: { $regex: `:${t}(:|$)` },
          })),
        ];
      } else {
        filterQuery.tenureType = { $regex: `^${areaType}(:|$)` };
      }
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

    if (filter?.priority) {
      filterQuery.priority = filter.priority;
    }

    if (filter?.dateFilters) {
      const dateFilter = JSON.parse(filter.dateFilters);

      for (const key in dateFilter) {
        if (Object.hasOwn(dateFilter, key)) {
          const { gte, lte } = dateFilter[key];

          if (!filterQuery[key]) {
            filterQuery[key] = {};
          }

          if (gte) {
            filterQuery[key].$gte = new Date(gte);
          }

          if (lte) {
            filterQuery[key].$lte = new Date(lte);
          }
        }
      }
    }

    if (filter?.startDate && !filter?.dateFilters) {
      filterQuery.startDate = { $gte: filter.startDate };
    }

    if (filter?.targetDate && !filter?.dateFilters) {
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

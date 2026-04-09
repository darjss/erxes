import { IContext } from '~/connectionResolvers';

type UnitQueryParams = {
  agencyId?: string;
  projectId?: string;
  memberId?: string;
  page?: number;
  perPage?: number;
};

const buildFilter = ({
  agencyId,
  projectId,
  memberId,
}: Pick<UnitQueryParams, 'agencyId' | 'projectId' | 'memberId'>) => {
  const filter: Record<string, string> = {};
  if (agencyId) filter.agencyId = agencyId;
  if (projectId) filter.projectId = projectId;
  if (memberId) filter.memberId = memberId;
  return filter;
};

export const blockUnitQueries = {
  blockAgencyGetUnits: async (
    _root: undefined,
    { agencyId, projectId, memberId, page = 1, perPage = 20 }: UnitQueryParams,
    { models }: IContext,
  ) => {
    return models.BlockUnitAssignment.find(buildFilter({ agencyId, projectId, memberId }))
      .sort({ assignedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();
  },

  blockAgencyGetUnitsTotalCount: async (
    _root: undefined,
    { agencyId, projectId, memberId }: Pick<UnitQueryParams, 'agencyId' | 'projectId' | 'memberId'>,
    { models }: IContext,
  ) => {
    return models.BlockUnitAssignment.countDocuments(
      buildFilter({ agencyId, projectId, memberId }),
    );
  },
};

import { IContext } from '~/connectionResolvers';

export const blockMemberQueries = {
  blockAgentGetMember: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BlockAgencyMember.getMember(_id);
  },

  blockAgentGetMembers: async (
    _root: undefined,
    {
      agencyId,
      page = 1,
      perPage = 20,
    }: { agencyId?: string; page?: number; perPage?: number },
    { models }: IContext,
  ) => {
    const filter = agencyId ? { agencyId } : {};

    return models.BlockAgencyMember.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();
  },

  blockAgentGetMembersTotalCount: async (
    _root: undefined,
    { agencyId }: { agencyId?: string },
    { models }: IContext,
  ) => {
    const filter = agencyId ? { agencyId } : {};

    return models.BlockAgencyMember.countDocuments(filter);
  },
};

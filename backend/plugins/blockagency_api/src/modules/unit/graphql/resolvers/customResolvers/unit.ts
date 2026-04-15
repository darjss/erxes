import { IContext } from '~/connectionResolvers';

export const BlockAgencyUnit = {
  agency: async (
    unit: { agencyId: string },
    _args: unknown,
    { models }: IContext,
  ) => {
    if (!unit.agencyId) return null;
    const agency = await models.BlockAgency.findById(unit.agencyId)
      .select('name')
      .lean();
    return agency ? { name: agency.name } : null;
  },
};

import { IContext } from '~/connectionResolvers';

export const unitLeadQueries = {
  blockGetUnitLeads: async (
    _root,
    { unit }: { unit: string },
    { models }: IContext,
  ) => {
    return models.UnitLead.find({ unit });
  },
};

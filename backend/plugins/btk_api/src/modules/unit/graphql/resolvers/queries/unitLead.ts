import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const unitLeadQueries = {
  btkGetUnitLeads: async (
    _root,
    { unit }: { unit: string },
    { models }: IContext,
  ) => {
    return models.UnitLead.find({ unit });
  },
};

requireLogin(unitLeadQueries, 'btkGetUnitLeads');

import { IContext } from '~/connectionResolvers';
import { IUnitLead } from '@/unit/@types/unitLead';

export const unitLeadMutations = {
  blockAddUnitLead: async (
    _parent: undefined,
    { input }: { input: IUnitLead },
    { models }: IContext,
  ) => {
    const existingLead = await models.UnitLead.findOne({ _id: input.leadId });
    if (existingLead) throw new Error('Lead already exists');

    return models.UnitLead.createUnitLead(input);
  },

  blockRemoveUnitLead: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.UnitLead.removeUnitLead(_id);
  },
};


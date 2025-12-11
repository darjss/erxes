import { IContext } from '~/connectionResolvers';
import { IOppty } from '@/oppty/@types/oppty';
import { IContractPaymentPlan } from '@/contract/@types/contract';

export const opptyMutations = {
  blockCreateOppty: async (
    _parent: undefined,
    { input }: { input: IOppty },
    { models }: IContext,
  ) => {
    return models.Oppty.createOppty(input);
  },

  blockUpdateOppty: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IOppty },
    { models }: IContext,
  ) => {
    return models.Oppty.updateOppty(_id, input);
  },

  blockDeleteOppty: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Oppty.deleteOppty(_id);
  },

  blockOpptyConvertToContract: async (
    _parent: undefined,
    {
      _id,
      unit,
      paymentPlan,
    }: { _id: string; unit: string; paymentPlan: IContractPaymentPlan },
    { models }: IContext,
  ) => {
    return 'success';
  },
};

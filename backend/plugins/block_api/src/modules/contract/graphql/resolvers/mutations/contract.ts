import { IContext } from '~/connectionResolvers';
import { IContract } from '@/contract/@types/contract';

export const contractMutations = {
  blockCreateContract: async (
    _parent: undefined,
    { input }: { input: IContract },
    { models }: IContext,
  ) => {
    return models.Contract.createContract(input);
  },
  blockUpdateContract: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IContract },
    { models }: IContext,
  ) => {
    return models.Contract.updateContract(_id, input);
  },
  blockUpdateContractStatus: async (
    _parent: undefined,
    { _id, status }: { _id: string; status: string },
    { models }: IContext,
  ) => {
    return models.Contract.updateContractStatus(_id, status);
  },
};

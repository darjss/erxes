import { IContext } from '~/connectionResolvers';
import { IContract } from '@/contract/@types/contract';
import { requireLogin } from 'erxes-api-shared/core-modules';

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
};

requireLogin(contractMutations, 'blockCreateContract');
requireLogin(contractMutations, 'blockUpdateContract');

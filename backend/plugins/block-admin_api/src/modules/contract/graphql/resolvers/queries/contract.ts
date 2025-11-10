import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const contractQueries = {
  blockGetContract: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Contract.getContract(_id);
  },

  blockGetContracts: async (
    _parent: undefined,
    { unit }: { unit: string },
    { models }: IContext,
  ) => {
    return models.Contract.find({ unit });
  },
};

requireLogin(contractQueries, 'blockGetContract');
requireLogin(contractQueries, 'blockGetContracts');

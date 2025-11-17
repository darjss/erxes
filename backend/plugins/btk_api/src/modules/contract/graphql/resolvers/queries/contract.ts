import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const contractQueries = {
  btkGetContract: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Contract.getContract(_id);
  },

  btkGetContracts: async (
    _parent: undefined,
    { unit }: { unit: string },
    { models }: IContext,
  ) => {
    return models.Contract.find({ unit });
  },
};

requireLogin(contractQueries, 'btkGetContract');
requireLogin(contractQueries, 'btkGetContracts');

import { requireLogin } from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';

export const contractQueries = {
  blockGetContract: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const contract = await models.Contract.findOne({ _id }).lean();

    if (!contract) {
      throw new Error('Contract not found');
    }

    return contract;
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

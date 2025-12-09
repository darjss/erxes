import { ICreditTransactionDocument } from '@/membership/@types/credittransaction';
import { IContext } from '~/connectionResolvers';

const resolvers = {
  OneFitCreditTransaction: {
    user: async (
      transaction: ICreditTransactionDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!transaction.userId) {
        return null;
      }
      return await models.OneFitCustomer.findOne({ _id: transaction.userId });
    },
  },
};

export default resolvers;


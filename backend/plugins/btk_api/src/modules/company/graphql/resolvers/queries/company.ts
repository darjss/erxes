import { requireLogin } from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';

export const companyQueries = {
  getCompanyCompanies: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return await models.Company.find({}).lean();
  },
  getCompanyInfo: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Company.findOne({ _id }).lean();
  },
};

requireLogin(companyQueries, 'getCompanyInfo');
requireLogin(companyQueries, 'getCompanyCompanies');

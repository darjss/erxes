import { IContext } from '~/connectionResolvers';

export const companyQueries = {
  getCompanyCompanies: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return await models.Company.find({ verificationStatus: 'approved' }).lean();
  },
  getCompanyInfo: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Company.findOne({ _id }).lean();
  },
};

import { CompanyQueryParams } from '~/modules/company/db/@types/company';
import { generateFilter } from '~/modules/company/utils';
import { IContext } from '~/connectionResolvers';

export const companyQueries = {
  btkAdminCompanies: async (
    _root: undefined,
    params: CompanyQueryParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params, models);

    return await models.Company.find(filter).lean();
  },
  btkAdminCompanyInfo: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Company.findOne({ _id }).lean();
  },
};

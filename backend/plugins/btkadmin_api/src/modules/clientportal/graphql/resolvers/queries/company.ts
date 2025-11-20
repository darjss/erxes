import { IOffsetPaginateParams } from 'erxes-api-shared/core-types';
import { paginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { CompanyQueryParams } from '~/modules/company/db/@types/company';
import { generateFilter } from '~/modules/company/utils';
import { markResolvers } from 'erxes-api-shared/utils';

export const cpCompanyQueries = {
  cpBtkAdminCompanyInfo: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Company.findOne({ _id }).lean();
  },
  cpBtkAdminCompanies: async (
    _root: undefined,
    params: CompanyQueryParams & IOffsetPaginateParams,
    { models }: IContext,
  ) => {
    const {
      page,
      perPage,
      sortField = 'createdAt',
      sortDirection = 'desc',
    } = params;

    const filter = await generateFilter(params, models);

    return await paginate(
      models.Company.find(filter).sort({ [sortField]: sortDirection }),
      { page, perPage },
    );
  },
};

markResolvers(cpCompanyQueries, {
  wrapperConfig: {
    forClientPortal: true,
  },
});

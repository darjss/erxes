import {
  CompanyQueryParams,
  IBtkCompanyDocument,
} from '~/modules/company/db/@types/company';
import { generateFilter } from '~/modules/company/utils';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const companyQueries = {
  getBtkAdminCompanies: async (
    _root: undefined,
    params: CompanyQueryParams & ICursorPaginateParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params);

    return await cursorPaginate<IBtkCompanyDocument>({
      model: models.Company,
      params,
      query: filter,
    });
  },
  getBtkAdminCompanyInfo: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Company.findOne({ _id }).lean();
  },
};

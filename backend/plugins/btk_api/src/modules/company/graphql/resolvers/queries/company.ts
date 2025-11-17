import { requireLogin } from 'erxes-api-shared/core-modules';

export const companyQueries = {
  getCompanyInfo: async (_, __, { models }) => {
    let existingCompany = await models.Company.findOne({});

    if (!existingCompany) {
      existingCompany = await models.Company.createCompany({});
    }

    return existingCompany;
  },
};

requireLogin(companyQueries, 'getCompanyInfo');

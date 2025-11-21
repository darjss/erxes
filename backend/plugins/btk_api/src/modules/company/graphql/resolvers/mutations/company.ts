import { requireLogin } from 'erxes-api-shared/core-modules';

export const companyMutations = {
  updateCompanyInfo: async (_, { _id, input }, { models }) => {
    const existingCompany = await models.Company.findOne({});

    if (!existingCompany) {
      return models.Company.createCompany(input);
    }

    return models.Company.updateCompany(existingCompany._id, input);
  },
};

requireLogin(companyMutations, 'updateCompanyInfo');

export const companyMutations = {
  updateCompanyInfo: async (_, { _id, input }, { models }) => {
    if (!_id) {
      return models.Company.createCompany(input);
    }

    const company = await models.Company.findOne({ _id });
    if (!company) {
      return models.Company.createCompany(input);
    }

    return models.Company.updateCompany(company._id, input);
  },
};

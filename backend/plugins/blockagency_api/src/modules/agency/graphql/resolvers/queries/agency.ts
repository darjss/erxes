export const blockAgencyQueries = {
  getAgencyInfo: async (_, __, { models }) => {
    let existingAgency = await models.BlockAgency.findOne({});

    if (!existingAgency) {
      existingAgency = await models.BlockAgency.createAgency({});
    }

    return existingAgency;
  },
  getAgencyVerificationStatus: async (_, __, { models }) => {
    let agencyVerificationStatus = await models.BlockAgency.findOne({});

    return agencyVerificationStatus;
  },
};

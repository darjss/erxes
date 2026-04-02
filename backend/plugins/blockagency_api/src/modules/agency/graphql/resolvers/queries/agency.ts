export const blockAgencyQueries = {
  getAgencyInfo: async (_, __, { models }) => {
    let existingDeveloper = await models.BlockAgency.findOne({});

    if (!existingDeveloper) {
      existingDeveloper = await models.BlockAgency.createAgency({});
    }

    return existingDeveloper;
  },
};


import { requireLogin } from 'erxes-api-shared/core-modules';

export const blockAgencyQueries = {
  getAgencyInfo: async (_, __, { models }) => {
    let existingDeveloper = await models.BlockAgency.findOne({});

    if (!existingDeveloper) {
      existingDeveloper = await models.BlockAgency.createAgency({});
    }

    return existingDeveloper;
  },
};

requireLogin(blockAgencyQueries, 'getAgencyInfo');

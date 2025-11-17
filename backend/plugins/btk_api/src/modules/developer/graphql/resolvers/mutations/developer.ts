import { requireLogin } from 'erxes-api-shared/core-modules';

export const developerMutations = {
  updateDeveloperInfo: async (_, { input }, { models }) => {
    const existingDeveloper = await models.Developer.findOne({});

    if (!existingDeveloper) {
      return models.Developer.createDeveloper(input);
    }

    return models.Developer.updateDeveloper(existingDeveloper._id, input);
  },
};

requireLogin(developerMutations, 'updateDeveloperInfo');

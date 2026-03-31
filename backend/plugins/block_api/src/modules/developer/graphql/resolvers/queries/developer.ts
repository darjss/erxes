export const developerQueries = {
  getDeveloperInfo: async (_, __, { models }) => {
    let existingDeveloper = await models.Developer.findOne({});

    if (!existingDeveloper) {
      existingDeveloper = await models.Developer.createDeveloper({});
    }

    return existingDeveloper;
  },
};


export const newsMemberQueries = {
  btkGetNewsMembers: async (_, { news }, { models }) => {
    return await models.NewsMember.find({ news });
  },
};

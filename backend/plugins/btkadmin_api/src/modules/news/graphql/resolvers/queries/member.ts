export const newsMemberQueries = {
  btkAdminGetNewsMembers: async (_, { news }, { models }) => {
    return await models.NewsMember.find({ news });
  },
};

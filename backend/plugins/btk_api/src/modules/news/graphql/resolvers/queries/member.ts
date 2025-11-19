import { requireLogin } from 'erxes-api-shared/core-modules';

export const newsMemberQueries = {
  btkGetNewsMembers: async (_, { news }, { models }) => {
    return await models.NewsMember.find({ news });
  },
};

requireLogin(newsMemberQueries, 'btkGetNewsMembers');

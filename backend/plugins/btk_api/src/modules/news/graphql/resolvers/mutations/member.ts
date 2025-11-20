import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const newsMemberMutations = {
  btkAddNewsMembers: async (
    _parent: undefined,
    { news, memberIds }: { news: string; memberIds: string[] },
    { models }: IContext,
  ) => {
    return models.NewsMember.addNewsMembers(
      memberIds.map((memberId) => ({
        memberId,
        news,
        role: 'member',
      })),
    );
  },

  btkUpdateNewsMember: async (
    _parent: undefined,
    { _id, role }: { _id: string; role: string },
    { models }: IContext,
  ) => {
    return models.NewsMember.updateNewsMember(_id, role);
  },
  btkDeleteNewsMember: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.NewsMember.deleteNewsMember(_id);
  },
};

requireLogin(newsMemberMutations, 'btkAddNewsMembers');
requireLogin(newsMemberMutations, 'btkUpdateNewsMember');
requireLogin(newsMemberMutations, 'btkDeleteNewsMember');

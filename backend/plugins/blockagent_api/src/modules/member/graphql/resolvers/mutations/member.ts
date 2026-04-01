import { IContext } from '~/connectionResolvers';
import { IBlockAgencyMember } from '~/modules/member/@types/member';

export const blockMemberMutations = {
  blockAgentCreateMember: async (
    _root: undefined,
    { input }: { input: IBlockAgencyMember },
    { models }: IContext,
  ) => {
    return models.BlockAgencyMember.createMember(input);
  },

  blockAgentUpdateMember: async (
    _root: undefined,
    { _id, input }: { _id: string; input: Partial<IBlockAgencyMember> },
    { models }: IContext,
  ) => {
    return models.BlockAgencyMember.updateMember(_id, input);
  },

  blockAgentRemoveMember: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    await models.BlockAgencyMember.removeMember(_id);
    return true;
  },
};

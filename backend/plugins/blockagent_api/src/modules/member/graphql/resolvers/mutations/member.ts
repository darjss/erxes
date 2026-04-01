import { IContext } from '~/connectionResolvers';
import { IBlockAgencyMember } from '~/modules/member/@types/member';

export const blockMemberMutations = {
  blockCreateMember: async (
    _root: undefined,
    { input }: { input: IBlockAgencyMember },
    { models }: IContext,
  ) => {
    return models.BlockAgencyMember.createMember(input);
  },

  blockUpdateMember: async (
    _root: undefined,
    { _id, input }: { _id: string; input: Partial<IBlockAgencyMember> },
    { models }: IContext,
  ) => {
    return models.BlockAgencyMember.updateMember(_id, input);
  },

  blockRemoveMember: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    await models.BlockAgencyMember.removeMember(_id);
    return true;
  },
};

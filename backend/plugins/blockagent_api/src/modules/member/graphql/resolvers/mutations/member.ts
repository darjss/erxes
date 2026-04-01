import { checkLogin, checkPermissionGroup } from 'erxes-api-shared/core-modules/permissions/utils';
import { IContext } from '~/connectionResolvers';
import { IBlockAgencyMember } from '~/modules/member/@types/member';

export const blockMemberMutations = {
  blockAgentCreateMember: async (
    _root: undefined,
    { input }: { input: IBlockAgencyMember },
    { models, user, subdomain }: IContext,
  ) => {
    checkLogin(user);
    const checkPermission = checkPermissionGroup(subdomain, user);
    await checkPermission('memberCreate');

    return models.BlockAgencyMember.createMember(input);
  },

  blockAgentUpdateMember: async (
    _root: undefined,
    { _id, input }: { _id: string; input: Partial<IBlockAgencyMember> },
    { models, user, subdomain }: IContext,
  ) => {
    checkLogin(user);
    const checkPermission = checkPermissionGroup(subdomain, user);
    await checkPermission('memberUpdate');

    return models.BlockAgencyMember.updateMember(_id, input);
  },

  blockAgentRemoveMember: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, user, subdomain }: IContext,
  ) => {
    checkLogin(user);
    const checkPermission = checkPermissionGroup(subdomain, user);
    await checkPermission('memberRemove');

    await models.BlockAgencyMember.removeMember(_id);
    return true;
  },
};

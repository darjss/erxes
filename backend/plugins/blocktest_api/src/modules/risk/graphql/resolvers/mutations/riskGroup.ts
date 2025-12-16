import { IContext } from '~/connectionResolvers';

export const cvRiskGroupMutations = {
  cvCreateRiskGroup: async (
    _parent: undefined,
    { input },
    { models }: IContext,
  ) => {
    return models.CVRiskGroups.createRiskGroup(input);
  },
  cvUpdateRiskGroup: async (
    _parent: undefined,
    { _id, input },
    { models }: IContext,
  ) => {
    return models.CVRiskGroups.updateRiskGroup(_id, input);
  },
  cvDeleteRiskGroup: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.CVRiskGroups.removeRiskGroup(_id);
  },
};

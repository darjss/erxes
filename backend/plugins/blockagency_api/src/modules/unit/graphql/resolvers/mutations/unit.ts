import { IContext } from '~/connectionResolvers';

export const blockUnitMutations = {
  blockAgencyAssignUnitToMember: async (
    _root: undefined,
    { _id, memberId }: { _id: string; memberId?: string },
    { models }: IContext,
  ) => {
    const assignment = await models.BlockUnitAssignment.findOneAndUpdate(
      { _id },
      { $set: { memberId: memberId || null } },
      { new: true },
    ).lean();

    if (!assignment) {
      throw new Error(`Unit assignment "${_id}" not found`);
    }

    return assignment;
  },

  blockAgencyRemoveUnit: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const result = await models.BlockUnitAssignment.findOneAndDelete({ _id });
    return !!result;
  },
};

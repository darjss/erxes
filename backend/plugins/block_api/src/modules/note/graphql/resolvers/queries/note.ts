import { IContext } from '~/connectionResolvers';

export const blockNoteQueries = {
  blockGetNote: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BlockNote.findOne({ _id });
  },
};

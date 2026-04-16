import { INoteDocument } from '@/note/types';
import { IContext } from '~/connectionResolvers';

export const blockNoteMutations = {
  blockCreateNote: async (
    _parent: undefined,
    {
      content,
      contentId,
      mentions,
      contentType,
    }: {
      content: string;
      contentId: string;
      mentions: string[];
      contentType: string;
    },
    { models, user }: IContext,
  ) => {
    return models.BlockNote.createNote({
      doc: {
        content,
        contentId,
        mentions,
        createdBy: user._id,
      },
      contentType,
    });
  },

  blockUpdateNote: async (
    _parent: undefined,
    params: INoteDocument,
    { models }: IContext,
  ) => {
    return models.BlockNote.updateNote(params);
  },

  blockDeleteNote: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models, user }: IContext,
  ) => {
    return models.BlockNote.removeNote({ _id, userId: user._id });
  },
};

import { FilterQuery, Model } from 'mongoose';

import { IModels } from '~/connectionResolvers';
import { noteSchema } from '@/note/db/definitions/note';
import { INote, INoteDocument } from '@/note/types';

export interface INoteModel extends Model<INoteDocument> {
  getNote(_id: string): Promise<INoteDocument>;
  getNotes(filter: FilterQuery<INoteDocument>): Promise<INoteDocument[]>;
  createNote({
    doc,
    contentType,
  }: {
    doc: INote;
    contentType: string;
  }): Promise<INoteDocument>;
  updateNote(doc: INoteDocument): Promise<INoteDocument | null>;
  removeNote({
    _id,
    userId,
  }: {
    _id: string;
    userId: string;
  }): Promise<{ ok: number }>;
}

export const loadNoteClass = (models: IModels) => {
  class Note {
    public static async getNote(_id: string): Promise<INoteDocument> {
      const note = await models.BlockNote.findOne({ _id }).lean();

      if (!note) {
        throw new Error('Note not found');
      }

      return note as INoteDocument;
    }

    public static async getNotes(
      filter: FilterQuery<INoteDocument>,
    ): Promise<INoteDocument[]> {
      return models.BlockNote.find(filter);
    }

    public static async createNote({
      doc,
    }: {
      doc: INote;
      subdomain: string;
      contentType: string;
    }): Promise<INoteDocument> {
      const note = await models.BlockNote.create(doc);

      return note;
    }

    public static async updateNote(
      doc: INoteDocument,
    ): Promise<INoteDocument | null> {
      const { _id, ...rest } = doc;

      return models.BlockNote.findOneAndUpdate(
        { _id },
        { $set: { ...rest } },
        { new: true },
      );
    }

    public static async removeNote({
      _id,
      userId,
    }: {
      _id: string;
      userId: string;
    }) {
      const note = await models.BlockNote.findOne({ _id });

      if (!note) {
        throw new Error('Note not found');
      }

      if (note.createdBy !== userId) {
        throw new Error('You are not authorized to remove this note');
      }

      return models.BlockNote.deleteOne({ _id });
    }
  }

  return noteSchema.loadClass(Note);
};

import { IBtkDocumentDocument } from '@/document/@types/document';
import { IModels } from '~/connectionResolvers';
import { documentSchema } from '@/document/db/definitions/document';
import { Model } from 'mongoose';

export interface IBtkDocumentModel extends Model<IBtkDocumentDocument> {
  createBtkDocument({
    input,
  }: {
    input: IBtkDocumentDocument;
  }): Promise<IBtkDocumentDocument>;
  updateBtkDocument({
    _id,
    input,
  }: {
    _id: string;
    input: IBtkDocumentDocument;
  }): Promise<IBtkDocumentDocument>;
  removeBtkDocument({ _id }: { _id: string }): Promise<IBtkDocumentDocument>;
}

export const loadBtkDocumentClass = (models: IModels) => {
  class BtkDocument {
    public static async createBtkDocument({
      input,
    }: {
      input: IBtkDocumentDocument;
    }) {
      return models.BtkDocument.create(input);
    }

    public static async updateBtkDocument({
      _id,
      input,
    }: {
      _id: string;
      input: IBtkDocumentDocument;
    }) {
      return models.BtkDocument.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeBtkDocument({ _id }: { _id: string }) {
      return models.BtkDocument.findOneAndDelete({ _id });
    }
  }

  documentSchema.loadClass(BtkDocument);

  return documentSchema;
};

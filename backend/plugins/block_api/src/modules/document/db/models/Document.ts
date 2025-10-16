import { IBlockDocumentDocument } from '@/document/@types/document';
import { IModels } from '~/connectionResolvers';
import { documentSchema } from '@/document/db/definitions/document';
import { Model } from 'mongoose';

export interface IBlockDocumentModel extends Model<IBlockDocumentDocument> {
  createBlockDocument({
    input,
  }: {
    input: IBlockDocumentDocument;
  }): Promise<IBlockDocumentDocument>;
  updateBlockDocument({
    _id,
    input,
  }: {
    _id: string;
    input: IBlockDocumentDocument;
  }): Promise<IBlockDocumentDocument>;
  removeBlockDocument({
    _id,
  }: {
    _id: string;
  }): Promise<IBlockDocumentDocument>;
}

export const loadBlockDocumentClass = (models: IModels) => {
  class BlockDocument {
    public static async createBlockDocument({
      input,
    }: {
      input: IBlockDocumentDocument;
    }) {
      return models.BlockDocument.create(input);
    }

    public static async updateBlockDocument({
      _id,
      input,
    }: {
      _id: string;
      input: IBlockDocumentDocument;
    }) {
      return models.BlockDocument.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeBlockDocument({ _id }: { _id: string }) {
      return models.BlockDocument.findOneAndDelete({ _id });
    }
  }

  documentSchema.loadClass(BlockDocument);

  return documentSchema;
};

import { IBlockDocumentDocument } from '@/document/@types/document';
import { IModels } from '~/connectionResolvers';
import { documentSchema } from '@/document/db/definitions/document';
import { Model } from 'mongoose';
import { IUserDocument } from 'erxes-api-shared/core-types';

export interface IBlockDocumentModel extends Model<IBlockDocumentDocument> {
  createBlockDocument({
    input,
    user,
  }: {
    input: IBlockDocumentDocument;
    user: IUserDocument;
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
      user,
    }: {
      input: IBlockDocumentDocument;
      user: IUserDocument;
    }) {
      return models.BlockDocument.create({ ...input, createdBy: user._id });
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

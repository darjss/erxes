import { IBlockDocumentDocument } from '@/document/@types/document';
import { documentSchema } from '@/document/db/definitions/document';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IBlockDocumentModel extends Model<IBlockDocumentDocument> {
  getBlockDocument(
    subdomain: string,
    entityId: string,
  ): Promise<IBlockDocumentDocument>;
  createBlockDocument({
    input,
  }: {
    input: IBlockDocumentDocument;
  }): Promise<IBlockDocumentDocument>;
  updateBlockDocument(
    subdomain: string,
    entityId: string,
    input: IBlockDocumentDocument,
  ): Promise<IBlockDocumentDocument>;
  removeBlockDocument(
    subdomain: string,
    entityId: string,
  ): Promise<IBlockDocumentDocument>;
}

export const loadBlockDocumentClass = (models: IModels) => {
  class BlockDocument {
    public static async getBlockDocument(subdomain: string, entityId: string) {
      const blockDocument = await models.BlockDocument.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!blockDocument) {
        throw new Error('Block document not found');
      }

      return blockDocument;
    }

    public static async createBlockDocument({
      input,
    }: {
      input: IBlockDocumentDocument;
    }) {
      return models.BlockDocument.create(input);
    }

    public static async updateBlockDocument(
      subdomain: string,
      entityId: string,
      input: IBlockDocumentDocument,
    ) {
      const { _id } = await models.BlockDocument.getBlockDocument(
        subdomain,
        entityId,
      );

      return models.BlockDocument.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeBlockDocument(
      subdomain: string,
      entityId: string,
    ) {
      const { _id } = await models.BlockDocument.getBlockDocument(
        subdomain,
        entityId,
      );

      return models.BlockDocument.findOneAndDelete({ _id });
    }
  }

  documentSchema.loadClass(BlockDocument);

  return documentSchema;
};

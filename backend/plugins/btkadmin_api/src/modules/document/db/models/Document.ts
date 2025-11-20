import { IBtkDocumentDocument } from '@/document/@types/document';
import { documentSchema } from '@/document/db/definitions/document';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IBtkDocumentModel extends Model<IBtkDocumentDocument> {
  getBtkDocument(
    subdomain: string,
    entityId: string,
  ): Promise<IBtkDocumentDocument>;
  createBtkDocument({
    input,
  }: {
    input: IBtkDocumentDocument;
  }): Promise<IBtkDocumentDocument>;
  updateBtkDocument(
    subdomain: string,
    entityId: string,
    input: IBtkDocumentDocument,
  ): Promise<IBtkDocumentDocument>;
  removeBtkDocument(
    subdomain: string,
    entityId: string,
  ): Promise<IBtkDocumentDocument>;
}

export const loadBtkDocumentClass = (models: IModels) => {
  class BtkDocument {
    public static async getBtkDocument(subdomain: string, entityId: string) {
      const btkDocument = await models.BtkDocument.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!btkDocument) {
        throw new Error('Btk document not found');
      }

      return btkDocument;
    }

    public static async createBtkDocument({
      input,
    }: {
      input: IBtkDocumentDocument;
    }) {
      return models.BtkDocument.create(input);
    }

    public static async updateBtkDocument(
      subdomain: string,
      entityId: string,
      input: IBtkDocumentDocument,
    ) {
      const { _id } = await models.BtkDocument.getBtkDocument(
        subdomain,
        entityId,
      );

      return models.BtkDocument.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeBtkDocument(subdomain: string, entityId: string) {
      const { _id } = await models.BtkDocument.getBtkDocument(
        subdomain,
        entityId,
      );

      return models.BtkDocument.findOneAndDelete({ _id });
    }
  }

  documentSchema.loadClass(BtkDocument);

  return documentSchema;
};

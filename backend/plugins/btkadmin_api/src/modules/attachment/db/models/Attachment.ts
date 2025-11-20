import {
  IBtkAttachment,
  IBtkAttachmentDocument,
} from '@/attachment/@types/attachment';
import { btkAttachmentSchema } from '@/attachment/db/definitions/attachment';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IBtkAttachmentModel extends Model<IBtkAttachmentDocument> {
  getBtkAttachment(
    subdomain: string,
    entityId: string,
  ): Promise<IBtkAttachmentDocument>;
  createBtkAttachment({
    input,
  }: {
    input: IBtkAttachment;
  }): Promise<IBtkAttachmentDocument>;
  updateBtkAttachment(
    subdomain: string,
    entityId: string,
    input: IBtkAttachment,
  ): Promise<IBtkAttachmentDocument>;
  removeBtkAttachment(
    subdomain: string,
    entityId: string,
  ): Promise<IBtkAttachmentDocument>;
}

export const loadBtkAttachmentClass = (models: IModels) => {
  class BtkAttachment {
    public static async getBtkAttachment(subdomain: string, entityId: string) {
      const btkAttachment = await models.BtkAttachment.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!btkAttachment) {
        throw new Error('Btk attachment not found');
      }

      return btkAttachment;
    }

    public static async createBtkAttachment({
      input,
    }: {
      input: IBtkAttachment;
    }) {
      return models.BtkAttachment.create(input);
    }

    public static async updateBtkAttachment({
      subdomain,
      entityId,
      input,
    }: {
      subdomain: string;
      entityId: string;
      input: IBtkAttachment;
    }) {
      const { _id } = await models.BtkAttachment.getBtkAttachment(
        subdomain,
        entityId,
      );

      return models.BtkAttachment.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeBtkAttachment(
      subdomain: string,
      entityId: string,
    ) {
      const { _id } = await models.BtkAttachment.getBtkAttachment(
        subdomain,
        entityId,
      );

      return models.BtkAttachment.findOneAndDelete({ _id });
    }
  }

  btkAttachmentSchema.loadClass(BtkAttachment);

  return btkAttachmentSchema;
};

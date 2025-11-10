import {
  IBlockAttachment,
  IBlockAttachmentDocument,
} from '@/attachment/@types/attachment';
import { blockAttachmentSchema } from '@/attachment/db/definitions/attachment';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IBlockAttachmentModel extends Model<IBlockAttachmentDocument> {
  getBlockAttachment(
    subdomain: string,
    entityId: string,
  ): Promise<IBlockAttachmentDocument>;
  createBlockAttachment({
    input,
  }: {
    input: IBlockAttachment;
  }): Promise<IBlockAttachmentDocument>;
  updateBlockAttachment(
    subdomain: string,
    entityId: string,
    input: IBlockAttachment,
  ): Promise<IBlockAttachmentDocument>;
  removeBlockAttachment(
    subdomain: string,
    entityId: string,
  ): Promise<IBlockAttachmentDocument>;
}

export const loadBlockAttachmentClass = (models: IModels) => {
  class BlockAttachment {
    public static async getBlockAttachment(
      subdomain: string,
      entityId: string,
    ) {
      const blockAttachment = await models.BlockAttachment.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!blockAttachment) {
        throw new Error('Block attachment not found');
      }

      return blockAttachment;
    }

    public static async createBlockAttachment({
      input,
    }: {
      input: IBlockAttachment;
    }) {
      return models.BlockAttachment.create(input);
    }

    public static async updateBlockAttachment({
      subdomain,
      entityId,
      input,
    }: {
      subdomain: string;
      entityId: string;
      input: IBlockAttachment;
    }) {
      const { _id } = await models.BlockAttachment.getBlockAttachment(
        subdomain,
        entityId,
      );

      return models.BlockAttachment.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeBlockAttachment(
      subdomain: string,
      entityId: string,
    ) {
      const { _id } = await models.BlockAttachment.getBlockAttachment(
        subdomain,
        entityId,
      );

      return models.BlockAttachment.findOneAndDelete({ _id });
    }
  }

  blockAttachmentSchema.loadClass(BlockAttachment);

  return blockAttachmentSchema;
};

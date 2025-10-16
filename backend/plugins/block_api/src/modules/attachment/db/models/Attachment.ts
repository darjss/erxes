import {
  IBlockAttachment,
  IBlockAttachmentDocument,
} from '@/attachment/@types/attachment';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { blockAttachmentSchema } from '@/attachment/db/definitions/attachment';

export interface IBlockAttachmentModel extends Model<IBlockAttachmentDocument> {
  createBlockAttachment({
    input,
  }: {
    input: IBlockAttachment;
  }): Promise<IBlockAttachmentDocument>;
  updateBlockAttachment({
    _id,
    input,
  }: {
    _id: string;
    input: IBlockAttachment;
  }): Promise<IBlockAttachmentDocument>;
  removeBlockAttachment({
    _id,
  }: {
    _id: string;
  }): Promise<IBlockAttachmentDocument>;
}

export const loadBlockAttachmentClass = (models: IModels) => {
  class BlockAttachment {
    public static async createBlockAttachment({
      input,
    }: {
      input: IBlockAttachment;
    }) {
      return models.BlockAttachment.create(input);
    }

    public static async updateBlockAttachment({
      _id,
      input,
    }: {
      _id: string;
      input: IBlockAttachment;
    }) {
      return models.BlockAttachment.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeBlockAttachment({ _id }: { _id: string }) {
      return models.BlockAttachment.findOneAndDelete({ _id });
    }
  }

  blockAttachmentSchema.loadClass(BlockAttachment);

  return blockAttachmentSchema;
};

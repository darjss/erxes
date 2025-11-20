import {
  IBtkAttachment,
  IBtkAttachmentDocument,
} from '@/attachment/@types/attachment';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { btkAttachmentSchema } from '@/attachment/db/definitions/attachment';

export interface IBtkAttachmentModel extends Model<IBtkAttachmentDocument> {
  createBtkAttachment({
    input,
  }: {
    input: IBtkAttachment;
  }): Promise<IBtkAttachmentDocument>;
  updateBtkAttachment({
    _id,
    input,
  }: {
    _id: string;
    input: IBtkAttachment;
  }): Promise<IBtkAttachmentDocument>;
  removeBtkAttachment({
    _id,
  }: {
    _id: string;
  }): Promise<IBtkAttachmentDocument>;
}

export const loadBtkAttachmentClass = (models: IModels) => {
  class BtkAttachment {
    public static async createBtkAttachment({
      input,
    }: {
      input: IBtkAttachment;
    }) {
      return models.BtkAttachment.create(input);
    }

    public static async updateBtkAttachment({
      _id,
      input,
    }: {
      _id: string;
      input: IBtkAttachment;
    }) {
      return models.BtkAttachment.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeBtkAttachment({ _id }: { _id: string }) {
      return models.BtkAttachment.findOneAndDelete({ _id });
    }
  }

  btkAttachmentSchema.loadClass(BtkAttachment);

  return btkAttachmentSchema;
};

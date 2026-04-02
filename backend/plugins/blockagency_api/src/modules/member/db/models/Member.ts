import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { blockAgencyMemberSchema } from '~/modules/member/db/definitions/member';
import {
  IBlockAgencyMember,
  IBlockAgencyMemberDocument,
} from '~/modules/member/@types/member';

export interface IBlockAgencyMemberModel
  extends Model<IBlockAgencyMemberDocument> {
  getMember(_id: string): Promise<IBlockAgencyMemberDocument | null>;
  createMember(
    input: IBlockAgencyMember,
  ): Promise<IBlockAgencyMemberDocument>;
  updateMember(
    _id: string,
    input: Partial<IBlockAgencyMember>,
  ): Promise<IBlockAgencyMemberDocument | null>;
  removeMember(_id: string): Promise<void>;
}

export const loadBlockAgencyMemberClass = (_models: IModels) => {
  class BlockAgencyMember {
    public static async getMember(_id: string) {
      return _models.BlockAgencyMember.findById(_id).lean();
    }

    public static async createMember(input: IBlockAgencyMember) {
      return _models.BlockAgencyMember.create(input);
    }

    public static async updateMember(
      _id: string,
      input: Partial<IBlockAgencyMember>,
    ) {
      return _models.BlockAgencyMember.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }

    public static async removeMember(_id: string) {
      await _models.BlockAgencyMember.deleteOne({ _id });
    }
  }

  blockAgencyMemberSchema.loadClass(BlockAgencyMember);

  return blockAgencyMemberSchema;
};

import { Model } from 'mongoose';

import { INewsMember, INewsMemberDocument } from '~/modules/news/@types/member';
import { btkNewsMemberSchema } from '~/modules/news/db/definitions/member';
import { IModels } from '~/connectionResolvers';

export interface INewsMemberModel extends Model<INewsMemberDocument> {
  getNewsMember(
    subdomain: string,
    entityId: string,
  ): Promise<INewsMemberDocument>;
  addNewsMember(member: INewsMember): Promise<INewsMemberDocument[]>;
  updateNewsMember(
    subdomain: string,
    entityId: string,
    role: string,
  ): Promise<INewsMemberDocument>;
  deleteNewsMember(
    subdomain: string,
    entityId: string,
  ): Promise<INewsMemberDocument>;
}

export const loadNewsMemberClass = (models: IModels) => {
  class NewsMember {
    public static async getNewsMember(subdomain: string, entityId: string) {
      const newsMember = await models.NewsMember.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!newsMember) {
        throw new Error('News member not found');
      }

      return newsMember;
    }

    public static async addNewsMember(member: INewsMember) {
      return models.NewsMember.create(member);
    }

    public static async updateNewsMember(
      subdomain: string,
      entityId: string,
      role: string,
    ) {
      const { _id } = await models.NewsMember.getNewsMember(
        subdomain,
        entityId,
      );

      return models.NewsMember.findOneAndUpdate(
        { _id },
        { $set: { role } },
        { new: true },
      );
    }

    public static async deleteNewsMember(subdomain: string, entityId: string) {
      const { _id } = await models.NewsMember.getNewsMember(
        subdomain,
        entityId,
      );

      return models.NewsMember.findOneAndDelete({ _id });
    }
  }

  btkNewsMemberSchema.loadClass(NewsMember);

  return btkNewsMemberSchema;
};

import { Model } from 'mongoose';

import { INewsMemberDocument } from '~/modules/news/@types/member';
import { IModels } from '~/connectionResolvers';
import { INewsMember } from '~/modules/news/@types/member';
import { btkNewsMemberSchema } from '~/modules/news/db/definitions/member';

export interface INewsMemberModel extends Model<INewsMemberDocument> {
  addNewsMembers(members: INewsMember[]): Promise<INewsMemberDocument[]>;
  updateNewsMember(_id: string, role: string): Promise<INewsMemberDocument>;
  deleteNewsMember(_id: string): Promise<INewsMemberDocument>;
}

export const loadNewsMemberClass = (models: IModels) => {
  class NewsMember {
    public static async addNewsMembers(members: INewsMember[]) {
      return models.NewsMember.insertMany(members);
    }

    public static async updateNewsMember(_id: string, role: string) {
      return models.NewsMember.findOneAndUpdate(
        { _id },
        { $set: { role } },
        { new: true },
      );
    }

    public static async deleteNewsMember(_id: string) {
      return models.NewsMember.findOneAndDelete({ _id });
    }
  }

  btkNewsMemberSchema.loadClass(NewsMember);

  return btkNewsMemberSchema;
};

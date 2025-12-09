import {
  IMembershipPlan,
  IMembershipPlanDocument,
} from '@/membership/@types/membership';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { membershipPlanSchema } from '../definitions/membership';

export interface IMembershipPlanModel extends Model<IMembershipPlanDocument> {
  createPlan(doc: IMembershipPlan): Promise<IMembershipPlanDocument>;
  updatePlan(
    _id: string,
    doc: Partial<IMembershipPlan>,
  ): Promise<IMembershipPlanDocument>;
  findActivePlans(): Promise<IMembershipPlanDocument[]>;
  removePlans(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadMembershipPlanClass = (models: IModels) => {
  class MembershipPlan {
    public static async createPlan(doc: IMembershipPlan) {
      return await models.MembershipPlan.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async updatePlan(_id: string, doc: Partial<IMembershipPlan>) {
      return await models.MembershipPlan.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...doc,
            modifiedAt: new Date(),
          },
        },
        { new: true },
      );
    }

    public static async findActivePlans() {
      return await models.MembershipPlan.find({ isActive: true });
    }

    public static async removePlans(ids: string[]) {
      return models.MembershipPlan.deleteMany({ _id: { $in: ids } });
    }
  }

  membershipPlanSchema.loadClass(MembershipPlan);

  return membershipPlanSchema;
};

import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { paymentPlanSchema } from '@/project/db/definitions/payment';
import {
  IProjectPaymentPlan,
  IProjectPaymentPlanDocument,
} from '@/project/@types/payment';
export interface IProjectPaymentPlanModel
  extends Model<IProjectPaymentPlanDocument> {
  createProjectPaymentPlan({
    input,
  }: {
    input: IProjectPaymentPlan;
  }): Promise<IProjectPaymentPlanDocument>;
  updateProjectPaymentPlan({
    _id,
    input,
  }: {
    _id: string;
    input: IProjectPaymentPlan;
  }): Promise<IProjectPaymentPlanDocument>;
}

export const loadProjectPaymentPlanClass = (models: IModels) => {
  class ProjectPaymentPlan {
    public static async createProjectPaymentPlan({
      input,
    }: {
      input: IProjectPaymentPlan;
    }) {
      return models.ProjectPaymentPlan.create(input);
    }

    public static async updateProjectPaymentPlan({
      _id,
      input,
    }: {
      _id: string;
      input: IProjectPaymentPlan;
    }) {
      return models.ProjectPaymentPlan.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }
  }

  paymentPlanSchema.loadClass(ProjectPaymentPlan);

  return paymentPlanSchema;
};

import {
  IProjectPaymentPlan,
  IProjectPaymentPlanDocument,
} from '@/project/@types/payment';
import { paymentPlanSchema } from '@/project/db/definitions/payment';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IProjectPaymentPlanModel
  extends Model<IProjectPaymentPlanDocument> {
  getProjectPaymentPlan(
    subdomain: string,
    entityId: string,
  ): Promise<IProjectPaymentPlanDocument>;
  createProjectPaymentPlan(
    input: IProjectPaymentPlan,
  ): Promise<IProjectPaymentPlanDocument>;
  updateProjectPaymentPlan(
    subdomain: string,
    entityId: string,
    input: IProjectPaymentPlan,
  ): Promise<IProjectPaymentPlanDocument>;
}

export const loadProjectPaymentPlanClass = (models: IModels) => {
  class ProjectPaymentPlan {
    public static async getProjectPaymentPlan(
      subdomain: string,
      entityId: string,
    ) {
      const projectPaymentPlan = await models.ProjectPaymentPlan.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!projectPaymentPlan) {
        throw new Error('Project payment plan not found');
      }

      return projectPaymentPlan;
    }

    public static async createProjectPaymentPlan(input: IProjectPaymentPlan) {
      return models.ProjectPaymentPlan.create(input);
    }

    public static async updateProjectPaymentPlan({
      subdomain,
      entityId,
      input,
    }: {
      subdomain: string;
      entityId: string;
      input: IProjectPaymentPlan;
    }) {
      const { _id } = await models.ProjectPaymentPlan.getProjectPaymentPlan(
        subdomain,
        entityId,
      );

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

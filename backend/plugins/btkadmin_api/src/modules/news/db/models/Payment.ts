import {
  INewsPaymentPlan,
  INewsPaymentPlanDocument,
} from '~/modules/news/@types/payment';
import { paymentPlanSchema } from '~/modules/news/db/definitions/payment';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface INewsPaymentPlanModel extends Model<INewsPaymentPlanDocument> {
  getNewsPaymentPlan(
    subdomain: string,
    entityId: string,
  ): Promise<INewsPaymentPlanDocument>;
  createNewsPaymentPlan({
    input,
  }: {
    input: INewsPaymentPlan;
  }): Promise<INewsPaymentPlanDocument>;
  updateNewsPaymentPlan(
    subdomain: string,
    entityId: string,
    input: INewsPaymentPlan,
  ): Promise<INewsPaymentPlanDocument>;
}

export const loadNewsPaymentPlanClass = (models: IModels) => {
  class NewsPaymentPlan {
    public static async getNewsPaymentPlan(
      subdomain: string,
      entityId: string,
    ) {
      const newsPaymentPlan = await models.NewsPaymentPlan.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!newsPaymentPlan) {
        throw new Error('News payment plan not found');
      }

      return newsPaymentPlan;
    }

    public static async createNewsPaymentPlan({
      input,
    }: {
      input: INewsPaymentPlan;
    }) {
      return models.NewsPaymentPlan.create(input);
    }

    public static async updateNewsPaymentPlan({
      subdomain,
      entityId,
      input,
    }: {
      subdomain: string;
      entityId: string;
      input: INewsPaymentPlan;
    }) {
      const { _id } = await models.NewsPaymentPlan.getNewsPaymentPlan(
        subdomain,
        entityId,
      );

      return models.NewsPaymentPlan.findOneAndUpdate(
        { _id },
        { $set: input },
        { new: true },
      );
    }
  }

  paymentPlanSchema.loadClass(NewsPaymentPlan);

  return paymentPlanSchema;
};

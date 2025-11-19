import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { paymentPlanSchema } from '~/modules/news/db/definitions/payment';
import {
  INewsPaymentPlan,
  INewsPaymentPlanDocument,
} from '~/modules/news/@types/payment';
export interface INewsPaymentPlanModel extends Model<INewsPaymentPlanDocument> {
  createNewsPaymentPlan({
    input,
  }: {
    input: INewsPaymentPlan;
  }): Promise<INewsPaymentPlanDocument>;
  updateNewsPaymentPlan({
    _id,
    input,
  }: {
    _id: string;
    input: INewsPaymentPlan;
  }): Promise<INewsPaymentPlanDocument>;
}

export const loadNewsPaymentPlanClass = (models: IModels) => {
  class NewsPaymentPlan {
    public static async createNewsPaymentPlan({
      input,
    }: {
      input: INewsPaymentPlan;
    }) {
      return models.NewsPaymentPlan.create(input);
    }

    public static async updateNewsPaymentPlan({
      _id,
      input,
    }: {
      _id: string;
      input: INewsPaymentPlan;
    }) {
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

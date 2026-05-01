import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { mushopSubscriptionSchema } from '@/subscription/db/definitions/mushopSubscription';
import { IMushopSubscriptionDocument } from '@/subscription/@types/mushopSubscription';
import { SUBSCRIPTION_STATUS } from '~/constants';

export interface IMushopSubscriptionModel
  extends Model<IMushopSubscriptionDocument> {
  getActiveSubscription(
    customerId: string,
  ): Promise<IMushopSubscriptionDocument | null>;
  createSubscription(doc: {
    customerId: string;
    planId: string;
    amount: number;
    currency: string;
    invoiceId?: string;
  }): Promise<IMushopSubscriptionDocument>;
  extendSubscription(
    _id: string,
    doc: {
      invoiceId: string;
      planId: string;
      amount: number;
      currency: string;
    },
  ): Promise<IMushopSubscriptionDocument | null>;
  cancelSubscription(_id: string): Promise<IMushopSubscriptionDocument | null>;
  expireStale(): Promise<void>;
}

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const loadMushopSubscriptionClass = (models: IModels) => {
  class MushopSubscription {
    public static async getActiveSubscription(customerId: string) {
      const subscription = await models.MushopSubscription.findOne({
        customerId,
        status: SUBSCRIPTION_STATUS.ACTIVE,
      }).lean();

      if (subscription && subscription.endDate < new Date()) {
        await models.MushopSubscription.updateOne(
          { _id: subscription._id },
          { $set: { status: SUBSCRIPTION_STATUS.EXPIRED } },
        );

        return null;
      }

      return subscription;
    }

    public static async createSubscription(doc: {
      customerId: string;
      planId: string;
      amount: number;
      currency: string;
      invoiceId?: string;
    }) {
      const plan = await models.MushopSubscriptionPlan.validateAndGet(
        doc.planId,
        doc.amount,
        doc.currency,
      );

      const startDate = new Date();
      const endDate = addMonths(startDate, plan.durationMonths);

      return models.MushopSubscription.create({
        ...doc,
        status: SUBSCRIPTION_STATUS.ACTIVE,
        startDate,
        endDate,
      });
    }

    public static async extendSubscription(
      _id: string,
      doc: {
        invoiceId: string;
        planId: string;
        amount: number;
        currency: string;
      },
    ) {
      const existing = await models.MushopSubscription.findOne({ _id });

      if (!existing) throw new Error('Subscription not found');

      const plan = await models.MushopSubscriptionPlan.validateAndGet(
        doc.planId,
        doc.amount,
        doc.currency,
      );

      const base =
        existing.endDate > new Date() ? existing.endDate : new Date();
      const newEndDate = addMonths(base, plan.durationMonths);

      return models.MushopSubscription.findOneAndUpdate(
        { _id },
        { $set: { endDate: newEndDate, ...doc } },
        { new: true },
      );
    }

    public static async cancelSubscription(_id: string) {
      return models.MushopSubscription.findOneAndUpdate(
        { _id },
        { $set: { status: SUBSCRIPTION_STATUS.CANCELLED } },
        { new: true },
      );
    }

    public static async expireStale() {
      await models.MushopSubscription.updateMany(
        { status: SUBSCRIPTION_STATUS.ACTIVE, endDate: { $lt: new Date() } },
        { $set: { status: SUBSCRIPTION_STATUS.EXPIRED } },
      );
    }
  }

  mushopSubscriptionSchema.loadClass(MushopSubscription);
  return mushopSubscriptionSchema;
};

import { Model } from 'mongoose';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { IModels } from '~/connectionResolvers';
import { mushopSubscriptionSchema } from '@/subscription/db/definitions/mushopSubscription';
import { IMushopSubscriptionDocument } from '@/subscription/@types/mushopSubscription';
import { SUBSCRIPTION_STATUS } from '~/constants';
import {
  buildSubscriptionCreatedLog,
  buildSubscriptionExtendedLog,
  buildSubscriptionCancelledLog,
  buildSubscriptionExpiredLog,
} from '~/meta/activity-log/mushopSubscription';

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
    invoiceId: string;
  }): Promise<IMushopSubscriptionDocument>;
  renewSubscription(
    _id: string,
    doc: { planId: string; amount: number; currency: string; invoiceId: string },
  ): Promise<IMushopSubscriptionDocument | null>;
  cancelSubscription(_id: string): Promise<IMushopSubscriptionDocument | null>;
  expireStale(): Promise<void>;
}

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const loadMushopSubscriptionClass = (
  models: IModels,
  { createActivityLog }: EventDispatcherReturn,
) => {
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
        const plan = subscription.planId
          ? await models.MushopSubscriptionPlan.findOne({ _id: subscription.planId }).lean()
          : null;
        createActivityLog(buildSubscriptionExpiredLog(subscription, plan?.name || 'Unknown'));
        return null;
      }

      return subscription;
    }

    public static async createSubscription(doc: {
      customerId: string;
      planId: string;
      amount: number;
      currency: string;
      invoiceId: string;
    }) {
      const plan = await models.MushopSubscriptionPlan.validateAndGet(
        doc.planId,
        doc.amount,
        doc.currency,
      );

      const startDate = new Date();
      const endDate = addMonths(startDate, plan.durationMonths);

      const sub = await models.MushopSubscription.create({
        ...doc,
        status: SUBSCRIPTION_STATUS.ACTIVE,
        startDate,
        endDate,
      });

      createActivityLog(buildSubscriptionCreatedLog(sub, plan.name));

      return sub;
    }

    public static async renewSubscription(
      _id: string,
      doc: { planId: string; amount: number; currency: string; invoiceId: string },
    ) {
      const existing = await models.MushopSubscription.findOne({ _id });
      if (!existing) throw new Error('Subscription not found');

      const plan = await models.MushopSubscriptionPlan.validateAndGet(
        doc.planId,
        doc.amount,
        doc.currency,
      );

      const prevEndDate = existing.endDate;
      const base = existing.endDate > new Date() ? existing.endDate : new Date();
      const newEndDate = addMonths(base, plan.durationMonths);

      const updated = await models.MushopSubscription.findOneAndUpdate(
        { _id },
        { $set: { endDate: newEndDate, planId: doc.planId, invoiceId: doc.invoiceId } },
        { new: true },
      );

      if (updated) {
        createActivityLog(buildSubscriptionExtendedLog(updated, plan.name, prevEndDate));
      }

      return updated;
    }

    public static async cancelSubscription(_id: string) {
      const updated = await models.MushopSubscription.findOneAndUpdate(
        { _id },
        { $set: { status: SUBSCRIPTION_STATUS.CANCELLED } },
        { new: true },
      );

      if (updated) {
        const plan = updated.planId
          ? await models.MushopSubscriptionPlan.findOne({ _id: updated.planId }).lean()
          : null;
        createActivityLog(buildSubscriptionCancelledLog(updated, plan?.name || 'Unknown'));
      }

      return updated;
    }

    public static async expireStale() {
      const stale = await models.MushopSubscription.find({
        status: SUBSCRIPTION_STATUS.ACTIVE,
        endDate: { $lt: new Date() },
      }).lean();

      await models.MushopSubscription.updateMany(
        { status: SUBSCRIPTION_STATUS.ACTIVE, endDate: { $lt: new Date() } },
        { $set: { status: SUBSCRIPTION_STATUS.EXPIRED } },
      );

      for (const sub of stale) {
        const plan = sub.planId
          ? await models.MushopSubscriptionPlan.findOne({ _id: sub.planId }).lean()
          : null;
        createActivityLog(buildSubscriptionExpiredLog(sub, plan?.name || 'Unknown'));
      }
    }
  }

  mushopSubscriptionSchema.loadClass(MushopSubscription);
  return mushopSubscriptionSchema;
};

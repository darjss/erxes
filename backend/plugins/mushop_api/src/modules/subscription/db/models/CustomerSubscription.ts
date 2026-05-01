import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { customerSubscriptionSchema } from '@/subscription/db/definitions/customerSubscription';
import { ICustomerSubscriptionDocument } from '@/subscription/@types/customerSubscription';
import { SUBSCRIPTION_STATUS } from '~/constants';

export interface ICustomerSubscriptionModel
  extends Model<ICustomerSubscriptionDocument> {
  getActiveSubscription(
    cpUserId: string,
  ): Promise<ICustomerSubscriptionDocument | null>;
  createSubscription(doc: {
    cpUserId: string;
    erxesCustomerId?: string;
    amount?: number;
    currency?: string;
    invoiceId?: string;
  }): Promise<ICustomerSubscriptionDocument>;
  extendSubscription(
    _id: string,
  ): Promise<ICustomerSubscriptionDocument | null>;
  cancelSubscription(
    _id: string,
  ): Promise<ICustomerSubscriptionDocument | null>;
  expireStale(): Promise<void>;
}

export const loadCustomerSubscriptionClass = (models: IModels) => {
  class CustomerSubscription {
    public static async getActiveSubscription(cpUserId: string) {
      const subscription = await models.CustomerSubscription.findOne({
        cpUserId,
        status: SUBSCRIPTION_STATUS.ACTIVE,
      }).lean();

      if (subscription && subscription.endDate < new Date()) {
        await models.CustomerSubscription.updateOne(
          { _id: subscription._id },
          { $set: { status: SUBSCRIPTION_STATUS.EXPIRED } },
        );

        return null;
      }

      return subscription;
    }

    public static async createSubscription(doc: {
      cpUserId: string;
      erxesCustomerId?: string;
      amount?: number;
      currency?: string;
      invoiceId?: string;
    }) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      return models.CustomerSubscription.create({
        ...doc,
        status: SUBSCRIPTION_STATUS.ACTIVE,
        startDate,
        endDate,
      });
    }

    public static async extendSubscription(_id: string) {
      const existing = await models.CustomerSubscription.findOne({ _id });
      if (!existing) throw new Error('Subscription not found');

      const base =
        existing.endDate > new Date() ? existing.endDate : new Date();
      const newEndDate = new Date(base);
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);

      return models.CustomerSubscription.findOneAndUpdate(
        { _id },
        { $set: { endDate: newEndDate } },
        { new: true },
      );
    }

    public static async cancelSubscription(_id: string) {
      return models.CustomerSubscription.findOneAndUpdate(
        { _id },
        { $set: { status: SUBSCRIPTION_STATUS.CANCELLED } },
        { new: true },
      );
    }

    public static async expireStale() {
      await models.CustomerSubscription.updateMany(
        { status: SUBSCRIPTION_STATUS.ACTIVE, endDate: { $lt: new Date() } },
        { $set: { status: SUBSCRIPTION_STATUS.EXPIRED } },
      );
    }
  }

  customerSubscriptionSchema.loadClass(CustomerSubscription);
  return customerSubscriptionSchema;
};

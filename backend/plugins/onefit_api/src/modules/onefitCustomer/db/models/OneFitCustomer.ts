import {
  IOneFitCustomer,
  IOneFitCustomerDocument,
} from '@/onefitCustomer/@types/onefitCustomer';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { onefitCustomerSchema } from '../definitions/onefitCustomer';

export interface IOneFitCustomerModel extends Model<IOneFitCustomerDocument> {
  updateMembership(
    customerId: string,
    membershipPlanId: string,
    expiresAt: Date,
  ): Promise<IOneFitCustomerDocument>;
  updateCreditBalance(
    customerId: string,
    balance: number,
  ): Promise<IOneFitCustomerDocument>;
  updateCreditBalanceAndEarned(
    customerId: string,
    balance: number,
    earnedAmount: number,
  ): Promise<IOneFitCustomerDocument>;
  updateCreditBalanceAndUsed(
    customerId: string,
    balance: number,
    usedAmount: number,
  ): Promise<IOneFitCustomerDocument>;
  updateCreditBalanceForRefund(
    customerId: string,
    balance: number,
    refundAmount: number,
  ): Promise<IOneFitCustomerDocument>;
  updateCreditTotals(
    customerId: string,
    balance: number,
    totalCreditsEarned: number,
    totalCreditsUsed: number,
  ): Promise<IOneFitCustomerDocument>;
  updateBookingStats(
    customerId: string,
    lastBookingDate?: Date,
  ): Promise<IOneFitCustomerDocument>;
  updateBookingPreferences(
    customerId: string,
    preferences: IOneFitCustomer['bookingPreferences'],
  ): Promise<IOneFitCustomerDocument>;
  getOneFitCustomer(_id: string): Promise<IOneFitCustomerDocument | null>;
  findOneFitCustomers(query: any): Promise<IOneFitCustomerDocument[]>;
}

export const loadOneFitCustomerClass = (models: IModels) => {
  class OneFitCustomer {
    public static async updateMembership(
      customerId: string,
      membershipPlanId: string,
      expiresAt: Date,
    ) {
      const now = new Date();
      const membershipStatus =
        expiresAt > now ? 'active' : expiresAt < now ? 'expired' : 'none';

      // Use 'this' to reference the model instance (discriminator)
      return await (this as any).findOneAndUpdate(
        { _id: customerId, __t: 'OneFitCustomer' },
        {
          $set: {
            membershipPlanId,
            membershipExpiresAt: expiresAt,
            membershipStatus,
          },
        },
        { new: true },
      );
    }

    public static async updateCreditBalance(
      customerId: string,
      balance: number,
    ) {
      return await (this as any).findOneAndUpdate(
        { _id: customerId, __t: 'OneFitCustomer' },
        {
          $set: {
            currentCreditBalance: balance,
          },
        },
        { new: true },
      );
    }

    public static async updateCreditBalanceAndEarned(
      customerId: string,
      balance: number,
      earnedAmount: number,
    ) {
      return await (this as any).findOneAndUpdate(
        { _id: customerId, __t: 'OneFitCustomer' },
        {
          $set: {
            currentCreditBalance: balance,
          },
          $inc: {
            totalCreditsEarned: earnedAmount,
          },
        },
        { new: true },
      );
    }

    public static async updateCreditBalanceAndUsed(
      customerId: string,
      balance: number,
      usedAmount: number,
    ) {
      return await (this as any).findOneAndUpdate(
        { _id: customerId, __t: 'OneFitCustomer' },
        {
          $set: {
            currentCreditBalance: balance,
          },
          $inc: {
            totalCreditsUsed: usedAmount,
          },
        },
        { new: true },
      );
    }

    public static async updateCreditBalanceForRefund(
      customerId: string,
      balance: number,
      refundAmount: number,
    ) {
      return await (this as any).findOneAndUpdate(
        { _id: customerId, __t: 'OneFitCustomer' },
        {
          $set: {
            currentCreditBalance: balance,
          },
          $inc: {
            totalCreditsUsed: -refundAmount,
          },
        },
        { new: true },
      );
    }

    public static async updateCreditTotals(
      customerId: string,
      balance: number,
      totalCreditsEarned: number,
      totalCreditsUsed: number,
    ) {
      return await (this as any).findOneAndUpdate(
        { _id: customerId, __t: 'OneFitCustomer' },
        {
          $set: {
            currentCreditBalance: balance,
            totalCreditsEarned,
            totalCreditsUsed,
          },
        },
        { new: true },
      );
    }

    public static async updateBookingStats(
      customerId: string,
      lastBookingDate?: Date,
    ) {
      const updateData: any = {
        $inc: { totalBookings: 1 },
      };

      if (lastBookingDate) {
        updateData.$set = { lastBookingDate };
      }

      return await (this as any).findOneAndUpdate(
        { _id: customerId, __t: 'OneFitCustomer' },
        updateData,
        { new: true },
      );
    }

    public static async updateBookingPreferences(
      customerId: string,
      preferences: IOneFitCustomer['bookingPreferences'],
    ) {
      return await (this as any).findOneAndUpdate(
        { _id: customerId, __t: 'OneFitCustomer' },
        {
          $set: {
            bookingPreferences: preferences,
          },
        },
        { new: true },
      );
    }

    public static async getOneFitCustomer(_id: string) {
      try {
        // Query by _id and check if it has OneFitCustomer discriminator
        const customer = await (this as any).findOne({ _id });

        // Return customer only if it has the OneFitCustomer discriminator set
        if (customer && customer.__t === 'OneFitCustomer') {
          return customer;
        }

        return null;
      } catch (error) {
        // If query fails, return null
        return null;
      }
    }

    public static async findOneFitCustomers(query: any) {
      return await (this as any).find({ ...query, __t: 'OneFitCustomer' });
    }
  }

  onefitCustomerSchema.loadClass(OneFitCustomer);

  return onefitCustomerSchema;
};

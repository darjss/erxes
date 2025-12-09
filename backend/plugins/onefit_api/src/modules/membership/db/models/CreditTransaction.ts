import {
  ICreditTransaction,
  ICreditTransactionDocument,
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { creditTransactionSchema } from '../definitions/credittransaction';

export interface ICreditTransactionModel
  extends Model<ICreditTransactionDocument> {
  createTransaction(doc: ICreditTransaction): Promise<ICreditTransactionDocument>;
  getUserBalance(userId: string): Promise<number>;
  getUserTransactions(
    userId: string,
    limit?: number,
  ): Promise<ICreditTransactionDocument[]>;
  getTransactionsByBooking(
    bookingId: string,
  ): Promise<ICreditTransactionDocument[]>;
  removeTransactions(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadCreditTransactionClass = (models: IModels) => {
  class CreditTransaction {
    public static async createTransaction(doc: ICreditTransaction) {
      return await models.CreditTransaction.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async getUserBalance(userId: string): Promise<number> {
      const transactions = await models.CreditTransaction.find({ userId }).sort({
        createdAt: -1,
      }).limit(1);

      if (transactions.length === 0) {
        return 0;
      }

      return transactions[0].balanceAfter;
    }

    public static async getUserTransactions(
      userId: string,
      limit: number = 100,
    ) {
      return await models.CreditTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
    }

    public static async getTransactionsByBooking(bookingId: string) {
      return await models.CreditTransaction.find({ bookingId });
    }

    public static async removeTransactions(ids: string[]) {
      return models.CreditTransaction.deleteMany({ _id: { $in: ids } });
    }
  }

  creditTransactionSchema.loadClass(CreditTransaction);

  return creditTransactionSchema;
};


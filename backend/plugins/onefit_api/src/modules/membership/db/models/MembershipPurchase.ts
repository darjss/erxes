import {
  IMembershipPurchase,
  IMembershipPurchaseDocument,
  MembershipPurchaseStatus,
} from '@/membership/@types/membershippurchase';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { membershipPurchaseSchema } from '../definitions/membershippurchase';

export interface IMembershipPurchaseModel
  extends Model<IMembershipPurchaseDocument> {
  createPurchase(
    doc: IMembershipPurchase,
  ): Promise<IMembershipPurchaseDocument>;
  getPurchase(_id: string): Promise<IMembershipPurchaseDocument>;
  updatePurchase(
    _id: string,
    doc: Partial<IMembershipPurchase>,
  ): Promise<IMembershipPurchaseDocument>;
  findByUserId(
    userId: string,
    filters?: {
      status?: MembershipPurchaseStatus;
      planId?: string;
    },
  ): Promise<IMembershipPurchaseDocument[]>;
  markAsPaid(_id: string): Promise<IMembershipPurchaseDocument>;
}

export const loadMembershipPurchaseClass = (models: IModels) => {
  class MembershipPurchase {
    public static async createPurchase(doc: IMembershipPurchase) {
      return await models.MembershipPurchase.create({
        ...doc,
        purchasedAt: doc.purchasedAt || new Date(),
        createdAt: new Date(),
      });
    }

    public static async getPurchase(_id: string) {
      const purchase = await models.MembershipPurchase.findOne({ _id });

      if (!purchase) {
        throw new Error('Membership purchase not found');
      }

      return purchase;
    }

    public static async updatePurchase(
      _id: string,
      doc: Partial<IMembershipPurchase>,
    ) {
      return await models.MembershipPurchase.findOneAndUpdate(
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

    public static async findByUserId(
      userId: string,
      filters?: {
        status?: MembershipPurchaseStatus;
        planId?: string;
      },
    ) {
      const query: any = { userId };

      if (filters?.status) {
        query.status = filters.status;
      }

      if (filters?.planId) {
        query.planId = filters.planId;
      }

      return await models.MembershipPurchase.find(query).sort({
        createdAt: -1,
      });
    }

    public static async markAsPaid(_id: string) {
      return await models.MembershipPurchase.findOneAndUpdate(
        { _id },
        {
          $set: {
            status: MembershipPurchaseStatus.PAID,
            paidAt: new Date(),
            modifiedAt: new Date(),
          },
        },
        { new: true },
      );
    }
  }

  membershipPurchaseSchema.loadClass(MembershipPurchase);

  return membershipPurchaseSchema;
};

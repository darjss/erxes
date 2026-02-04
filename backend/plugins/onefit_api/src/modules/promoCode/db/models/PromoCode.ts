import { IPromoCode, IPromoCodeDocument } from '@/promoCode/@types/promoCode';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { promoCodeSchema } from '../definitions/promoCode';

export interface IPromoCodeModel extends Model<IPromoCodeDocument> {
  createPromoCode(doc: IPromoCode): Promise<IPromoCodeDocument>;
  updatePromoCode(
    _id: string,
    doc: Partial<IPromoCode>,
  ): Promise<IPromoCodeDocument>;
  removePromoCodes(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadPromoCodeClass = (models: IModels) => {
  class PromoCode {
    public static async createPromoCode(doc: IPromoCode) {
      return await models.PromoCode.create({
        ...doc,
        usedCount: doc.usedCount ?? 0,
        isActive: doc.isActive ?? true,
        createdAt: new Date(),
      });
    }

    public static async updatePromoCode(_id: string, doc: Partial<IPromoCode>) {
      return await models.PromoCode.findOneAndUpdate(
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

    public static async removePromoCodes(ids: string[]) {
      return models.PromoCode.deleteMany({ _id: { $in: ids } });
    }
  }

  promoCodeSchema.loadClass(PromoCode);

  return promoCodeSchema;
};

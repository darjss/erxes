import { IContext } from '~/connectionResolvers';
import {
  IPromoCode,
  PromoCodeDiscountType,
} from '@/promoCode/@types/promoCode';
import { markResolvers } from 'erxes-api-shared/utils';

export const promoCodeMutations = {
  async oneFitPromoCodeCreate(
    _root: undefined,
    doc: IPromoCode,
    context: IContext,
  ) {
    const { models } = context;

    const normalizedCode = doc.code?.trim().toUpperCase();
    if (!normalizedCode) {
      throw new Error('Code is required');
    }

    const existing = await models.PromoCode.findOne({
      code: { $regex: new RegExp(`^${normalizedCode}$`, 'i') },
    });
    if (existing) {
      throw new Error('Promo code with this code already exists');
    }

    return await models.PromoCode.createPromoCode({
      ...doc,
      code: normalizedCode,
      discountType:
        doc.discountType ??
        (PromoCodeDiscountType.PERCENT as IPromoCode['discountType']),
      isActive: doc.isActive ?? true,
      isCompanyTag: doc.isCompanyTag ?? false,
    });
  },

  async oneFitPromoCodeUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IPromoCode>,
    context: IContext,
  ) {
    const { models } = context;
    const promoCode = await models.PromoCode.findOne({ _id });

    if (!promoCode) {
      throw new Error('Promo code not found');
    }

    if (doc.code !== undefined) {
      const normalizedCode = doc.code.trim().toUpperCase();
      if (!normalizedCode) {
        throw new Error('Code is required');
      }
      const existing = await models.PromoCode.findOne({
        _id: { $ne: _id },
        code: { $regex: new RegExp(`^${normalizedCode}$`, 'i') },
      });
      if (existing) {
        throw new Error('Promo code with this code already exists');
      }
      doc.code = normalizedCode;
    }

    return await models.PromoCode.updatePromoCode(_id, doc);
  },

  async oneFitPromoCodesRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    context: IContext,
  ) {
    const { models } = context;
    return await models.PromoCode.removePromoCodes(ids);
  },
};

markResolvers(promoCodeMutations, {
  wrapperConfig: {
    skipPermission: true,
  },
});

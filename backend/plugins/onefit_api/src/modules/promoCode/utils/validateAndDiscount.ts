import { IContext } from '~/connectionResolvers';
import { PromoCodeDiscountType } from '@/promoCode/@types/promoCode';

export interface IValidateAndDiscountResult {
  promoCodeId: string;
  discountedAmount: number;
}

export async function validateAndDiscount(
  context: IContext,
  options: {
    promoCode?: string;
    promoCodeId?: string;
    originalPrice: number;
  },
): Promise<IValidateAndDiscountResult> {
  const { models } = context;
  const { promoCode, promoCodeId, originalPrice } = options;

  if (!promoCode && !promoCodeId) {
    throw new Error('Promo code or promo code ID is required');
  }

  let promo;
  if (promoCodeId) {
    promo = await models.PromoCode.findOne({ _id: promoCodeId });
  } else if (promoCode) {
    const normalizedCode = promoCode.trim().toUpperCase();
    promo = await models.PromoCode.findOne({
      code: { $regex: new RegExp(`^${normalizedCode}$`, 'i') },
    });
  }

  if (!promo) {
    throw new Error('Promo code not found');
  }

  if (promo.isActive === false) {
    throw new Error('Promo code is not active');
  }

  const now = new Date();
  if (promo.validFrom && new Date(promo.validFrom) > now) {
    throw new Error('Promo code is not yet valid');
  }
  if (promo.validTo && new Date(promo.validTo) < now) {
    throw new Error('Promo code has expired');
  }

  const usedCount = promo.usedCount ?? 0;
  const usageLimit = promo.usageLimit ?? Infinity;
  if (usedCount >= usageLimit) {
    throw new Error('Promo code usage limit reached');
  }
  console.log('promo  ', promo);
  let discountedAmount: number;
  if (promo.discountType === PromoCodeDiscountType.PERCENT) {
    discountedAmount = Math.max(
      0,
      originalPrice * (1 - (promo.value ?? 0) / 100),
    );
    console.log('discountedAmount', discountedAmount);
  } else {
    discountedAmount = Math.max(0, originalPrice - (promo.value ?? 0));
  }

  return {
    promoCodeId: promo._id,
    discountedAmount,
  };
}

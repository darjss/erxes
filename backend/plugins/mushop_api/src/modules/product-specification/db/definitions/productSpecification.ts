import { Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { IMushopProductSpecificationDocument } from '@/product-specification/@types/productSpecification';

// One row per product, keyed by productId. It deliberately does NOT use
// schemaWrapper: that adds a unique (subdomain, entityId) index, and since those
// fields are never set every row would collide on (null, null).
export const mushopProductSpecificationSchema =
  new Schema<IMushopProductSpecificationDocument>(
    {
      _id: mongooseStringRandomId,
      // Core product `_id` this specification record belongs to.
      productId: { type: String, required: true, unique: true, index: true },
      moq: { type: Number },
      // Yuan purchase cost for this product; unitPrice = cnyCost * exchange rate.
      cnyCost: { type: Number },
      // Per-product margin/prepayment as percentages of unitPrice. The currency
      // amounts (dun) are always derived from unitPrice, so they are not stored.
      profitPercent: { type: Number },
      prepaymentPercent: { type: Number },
    },
    {
      timestamps: true,
    },
  );

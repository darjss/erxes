import { Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { schemaWrapper } from '~/utils';
import { IMushopProductMushopDocument } from '@/product/@types/product';

export const MUSHOP_PRODUCT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ALL: ['pending', 'approved', 'rejected'],
};

export const mushopProductSchema = schemaWrapper(
  new Schema<IMushopProductMushopDocument>(
    {
      _id: mongooseStringRandomId,
      name: { type: String },
      shortName: { type: String },
      code: { type: String },
      type: { type: String },
      description: { type: String },
      barcodes: { type: [String], default: [] },
      variants: { type: Object },
      barcodeDescription: { type: String },
      unitPrice: { type: Number },
      categoryId: { type: String, index: true },
      category: {
        type: new Schema(
          {
            _id: { type: String },
            name: { type: String },
            code: { type: String },
            order: { type: String },
            parentId: { type: String },
          },
          { _id: false },
        ),
      },
      vendorId: { type: String, index: true },
      propertiesData: { type: Object },
      tagIds: { type: [String], default: [] },
      attachment: { type: Object },
      attachmentMore: { type: [Object], default: [] },
      scopeBrandIds: { type: [String], default: [] },
      uom: { type: String },
      subUoms: { type: Object },
      currency: { type: String },
      pdfAttachment: { type: Object },
      mushopCategoryId: { type: String, index: true },
      status: {
        type: String,
        enum: MUSHOP_PRODUCT_STATUS.ALL,
        default: MUSHOP_PRODUCT_STATUS.PENDING,
      },
    },
    {
      timestamps: true,
    },
  ),
);

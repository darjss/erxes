import { Schema } from 'mongoose';
import { mongooseStringRandomId, schemaWrapper } from 'erxes-api-shared/utils';
import { INVENTORY_STATUS } from '~/constants';
import { IInventoryItemDocument } from '@/inventories/@types/inventory';

export const inventoryItemSchema = schemaWrapper(
  new Schema<IInventoryItemDocument>(
    {
      _id: mongooseStringRandomId,
      supplierId: { type: String, required: true, index: true },
      productId: { type: String, required: true, index: true },
      barcode: { type: String, label: 'Barcode' },
      quantity: { type: Number, default: 0, label: 'Quantity' },
      safeRemainder: { type: Number, default: 0, label: 'Safe remainder' },
      status: {
        type: String,
        enum: INVENTORY_STATUS.ALL,
        default: INVENTORY_STATUS.ACTIVE,
        label: 'Status',
      },
      notes: { type: String, label: 'Notes' },
    },
    { timestamps: true },
  ),
);

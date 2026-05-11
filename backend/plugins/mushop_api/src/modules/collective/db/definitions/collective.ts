import { Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import {
  COLLECTIVE_STATUS,
  ICollectiveDocument,
  ICollectiveSupplierSyncResult,
} from '@/collective/@types/collective';

const collectiveSyncResultSchema = new Schema<ICollectiveSupplierSyncResult>(
  {
    supplierId: { type: String, required: true },
    subdomain: { type: String },
    total: { type: Number, default: 0 },
    created: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    errors: { type: [String], default: [] },
  },
  { _id: false },
);

export const collectiveSchema = new Schema<ICollectiveDocument>(
  {
    _id: mongooseStringRandomId,
    name: { type: String, required: true, label: 'Name' },
    description: { type: String, label: 'Description' },
    targetSubdomain: {
      type: String,
      required: true,
      unique: true,
      label: 'Target SaaS subdomain',
    },
    supplierIds: { type: [String], default: [], index: true },
    status: {
      type: String,
      enum: COLLECTIVE_STATUS.ALL,
      default: COLLECTIVE_STATUS.PENDING,
      index: true,
    },
    syncResults: { type: [collectiveSyncResultSchema], default: [] },
    totalCreated: { type: Number, default: 0 },
    totalFailed: { type: Number, default: 0 },
    lastSyncedAt: { type: Date },
    createdBy: { type: String, index: true },
  },
  { timestamps: true },
);

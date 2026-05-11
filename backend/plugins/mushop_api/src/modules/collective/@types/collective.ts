import { Document } from 'mongoose';

export const COLLECTIVE_STATUS = {
  PENDING: 'pending',
  SYNCING: 'syncing',
  ACTIVE: 'active',
  FAILED: 'failed',
  ALL: ['pending', 'syncing', 'active', 'failed'],
};

export interface ICollectiveSupplierSyncResult {
  supplierId: string;
  subdomain?: string;
  total: number;
  created: number;
  failed: number;
  errors?: string[];
}

export interface ICollective {
  name: string;
  description?: string;
  targetSubdomain: string;
  supplierIds: string[];
  status?: string;
  syncResults?: ICollectiveSupplierSyncResult[];
  totalCreated?: number;
  totalFailed?: number;
  lastSyncedAt?: Date;
  createdBy?: string;
}

export interface ICollectiveDocument extends ICollective, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectiveQueryParams {
  searchValue?: string;
  status?: string;
  targetSubdomain?: string;
  supplierId?: string;
}

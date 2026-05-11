import crypto from 'crypto';
import { isDev } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import {
  COLLECTIVE_STATUS,
  ICollectiveSupplierSyncResult,
} from '@/collective/@types/collective';

const buildProductDoc = (product: any): Record<string, any> => {
  return {
    name: product.name,
    shortName: product.shortName,
    code: product.code,
    type: product.type,
    description: product.description,
    barcodes: product.barcodes ?? [],
    barcodeDescription: product.barcodeDescription,
    variants: product.variants ?? {},
    unitPrice: product.unitPrice,
    categoryId: product.categoryId,
    tagIds: product.tagIds ?? [],
    attachment: product.attachment,
    attachmentMore: product.attachmentMore ?? [],
    scopeBrandIds: product.scopeBrandIds ?? [],
    uom: product.uom,
    subUoms: product.subUoms,
    currency: product.currency,
    pdfAttachment: product.pdfAttachment,
    vendorId: product.vendorId,
    propertiesData: product.propertiesData,
    status: 'active',
  };
};

interface CollectiveWebhookResult {
  total: number;
  created: number;
  failed: number;
  results: Array<{
    code?: string;
    ok: boolean;
    productId?: string;
    error?: string;
  }>;
}

const postToCollectiveWebhook = async ({
  targetSubdomain,
  collectiveId,
  products,
}: {
  targetSubdomain: string;
  collectiveId: string;
  products: Record<string, any>[];
}): Promise<CollectiveWebhookResult> => {
  const { SUPPLIER_API_URL, MUSHOP_SECRET } = process.env;
  if (!SUPPLIER_API_URL || !MUSHOP_SECRET) {
    throw new Error('SUPPLIER_API_URL or MUSHOP_SECRET is not configured');
  }

  const baseUrl = isDev
    ? SUPPLIER_API_URL
    : SUPPLIER_API_URL.replace('<subdomain>', targetSubdomain);

  const endpoint = `${baseUrl}/pl:supplier/webhook/mushop/collective`;

  const body = JSON.stringify({
    subdomain: targetSubdomain,
    payload: { collectiveId, products },
  });

  const signature = crypto
    .createHmac('sha256', MUSHOP_SECRET)
    .update(body)
    .digest('hex');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': `sha256=${signature}`,
    },
    body,
    signal: AbortSignal.timeout(120000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Collective webhook HTTP ${res.status}: ${text}`);
  }

  return (await res.json()) as CollectiveWebhookResult;
};

export const syncCollectiveProducts = async ({
  models,
  collectiveId,
}: {
  models: IModels;
  collectiveId: string;
}): Promise<void> => {
  const collective = await models.Collective.findOne({ _id: collectiveId });

  if (!collective) return;

  await models.Collective.updateSyncProgress(collectiveId, {
    status: COLLECTIVE_STATUS.SYNCING,
  });

  const suppliers = await models.Supplier.find({
    _id: { $in: collective.supplierIds },
  }).lean();

  const results: ICollectiveSupplierSyncResult[] = [];

  let totalCreated = 0;
  let totalFailed = 0;

  for (const supplier of suppliers) {
    const products = await models.MushopProduct.find({
      subdomain: supplier.subdomain,
      status: 'approved',
    }).lean();

    const result: ICollectiveSupplierSyncResult = {
      supplierId: supplier._id,
      subdomain: supplier.subdomain,
      total: products.length,
      created: 0,
      failed: 0,
      errors: [],
    };

    if (!products.length) {
      results.push(result);

      continue;
    }

    const docs = products.map(buildProductDoc);

    try {
      const response = await postToCollectiveWebhook({
        targetSubdomain: collective.targetSubdomain,
        collectiveId: collective._id,
        products: docs,
      });

      result.created = response.created;
      result.failed = response.failed;
      result.errors = response.results
        .filter((r) => !r.ok)
        .map((r) => `${r.code ?? '<no-code>'}: ${r.error ?? 'unknown'}`);
    } catch (e: any) {
      result.failed = products.length;
      result.errors = [`transport: ${e?.message ?? String(e)}`];
    }

    totalCreated += result.created;
    totalFailed += result.failed;
    results.push(result);
  }

  await models.Collective.updateSyncProgress(collectiveId, {
    status:
      totalFailed > 0 && totalCreated === 0
        ? COLLECTIVE_STATUS.FAILED
        : COLLECTIVE_STATUS.ACTIVE,
    syncResults: results,
    totalCreated,
    totalFailed,
    lastSyncedAt: new Date(),
  });
};

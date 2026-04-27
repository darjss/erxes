import { ActivityLogInput } from 'erxes-api-shared/core-modules';

const formatStatus = (value?: string) =>
  (value || 'unknown')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getProductLabel = (product: any) => {
  if (product?.name) {
    return `Product "${product.name}"`;
  }

  if (product?.code) {
    return `Product (${product.code})`;
  }

  if (product?.entityId) {
    return `Product (${product.entityId})`;
  }

  return 'Product';
};

export const buildMushopProductTarget = (product: any) => ({
  _id: product._id,
  entityId: product.entityId,
});

export const buildProductSubmittedLog = (product: any): ActivityLogInput => ({
  activityType: 'product.submitted',
  target: buildMushopProductTarget(product),
  action: {
    type: 'submitted',
    description: `${getProductLabel(product)} was submitted by the supplier and is awaiting review`,
  },
  changes: { status: 'pending' },
  metadata: {},
});

export const buildProductResubmittedLog = (product: any): ActivityLogInput => ({
  activityType: 'product.resubmitted',
  target: buildMushopProductTarget(product),
  action: {
    type: 'resubmitted',
    description: `${getProductLabel(
      product,
    )} was resubmitted by the supplier and moved back to Pending review`,
  },
  changes: { status: 'pending' },
  metadata: {},
});

export const buildProductStatusChangedLog = (
  product: any,
  status: string,
  note?: string,
): ActivityLogInput => ({
  activityType: 'product.status_changed',
  target: buildMushopProductTarget(product),
  action: {
    type: status,
    description: `${getProductLabel(product)} status changed to ${formatStatus(
      status,
    )}${note ? `. Note: ${note}` : ''}`,
  },
  changes: { status },
  metadata: { note },
});

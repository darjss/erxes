import { ActivityLogInput } from 'erxes-api-shared/core-modules';

const formatStatus = (value?: string) =>
  (value || 'unknown')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getSupplierLabel = (supplier: any) => {
  if (supplier?.name) {
    return `Supplier "${supplier.name}"`;
  }

  if (supplier?._id) {
    return `Supplier (${supplier._id})`;
  }

  return 'Supplier';
};

export const buildSupplierTarget = (supplier: any) => ({
  _id: supplier._id,
});

export const buildSupplierVerificationChangedLog = (
  supplier: any,
  verificationStatus: string,
  note?: string,
): ActivityLogInput => ({
  activityType: 'supplier.verification_changed',
  target: buildSupplierTarget(supplier),
  action: {
    type: verificationStatus,
    description: `${getSupplierLabel(supplier)} verification status changed to ${formatStatus(
      verificationStatus,
    )}${note ? `. Note: ${note}` : ''}`,
  },
  changes: { verificationStatus },
  metadata: { note },
});

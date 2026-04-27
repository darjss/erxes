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

  if (supplier?.entityId) {
    return `Supplier (${supplier.entityId})`;
  }

  return 'Supplier';
};

const getUpdatedFieldLabels = (input: Record<string, any> = {}) => {
  const excludedFields = new Set(['updatedAt', 'createdAt']);

  return Object.entries(input)
    .filter(([key, value]) => !excludedFields.has(key) && value !== undefined)
    .map(([key]) => key)
    .slice(0, 4);
};

export const buildMushopSupplierTarget = (supplier: any) => ({
  _id: supplier._id,
  entityId: supplier.entityId,
});

export const buildSupplierStatusChangedLog = (
  supplier: any,
  verificationStatus: string,
  note?: string,
): ActivityLogInput => ({
  activityType: 'supplier.status_changed',
  target: buildMushopSupplierTarget(supplier),
  action: {
    type: verificationStatus,
    description: `${getSupplierLabel(supplier)} verification status changed to ${formatStatus(
      verificationStatus,
    )}${note ? `. Note: ${note}` : ''}`,
  },
  changes: { verificationStatus },
  metadata: { note },
});

export const buildSupplierRegisteredLog = (supplier: any): ActivityLogInput => ({
  activityType: 'supplier.registered',
  target: buildMushopSupplierTarget(supplier),
  action: {
    type: 'registered',
    description: `${getSupplierLabel(supplier)} registered in Mushop`,
  },
  changes: {},
  metadata: {},
});

export const buildSupplierProfileUpdatedLog = (
  supplier: any,
  input: any,
): ActivityLogInput => {
  const updatedFields = getUpdatedFieldLabels(input);
  const fieldsText = updatedFields.length
    ? ` Updated fields: ${updatedFields.join(', ')}.`
    : '';

  return {
    activityType: 'supplier.profile_updated',
    target: buildMushopSupplierTarget(supplier),
    action: {
      type: 'profileUpdated',
      description: `${getSupplierLabel(
        supplier,
      )} profile was synced from Mushop.${fieldsText}`,
    },
    changes: input || {},
    metadata: { updatedFields },
  };
};

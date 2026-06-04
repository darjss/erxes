export const SUPPLIER_VERIFICATION_STATUS = {
  VERIFIED: 'verified',
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  ALL: ['verified', 'unverified', 'pending'],
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  // PAUSED: 'paused',
  // SUSPENDED: 'suspended',
  ALL: [
    'active', 
    'expired', 
    'cancelled', 
    // 'paused', 
    // 'suspended'
  ],
};

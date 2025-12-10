export const BLOCK_VERIFICATION_STATUS = {
  VERIFIED: 'verified',
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  ALL: ['verified', 'unverified', 'pending'],
};

export const IMAGE_FIELDS = ['logo', 'coverImage', 'images', 'planImages'];

export const TIER_LEVELS: Record<number, string> = {
  1: 'Bronze',
  2: 'Silver',
  3: 'Gold',
  4: 'Platinum',
};

export type VerificationStatus = 'pending' | 'unverified' | 'verified';

export enum StatusTitle {
  pending = 'Verification Pending',
  unverified = 'Verification Rejected',
  verified = 'Verification Successful',
}

export enum StatusDescription {
  pending = 'Our admin team is reviewing the information you submitted.',
  unverified = 'Our admin team has reviewed your submitted information and determined that revisions are required.',
  verified = 'Your agent profile has been successfully verified. You can now use all available features.',
}

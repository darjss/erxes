export type RegistrationApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected';

export interface IRegistrationApplication {
  membershipTypeId: string;
  schemaVersion: string;
  status: RegistrationApplicationStatus;
  answers: Record<string, unknown>;
  subdomain: string;
  instanceId?: string;
  cpUserId?: string;
  clientPortalId?: string;
  cpUserPhone?: string;
}

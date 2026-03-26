import { getRegistrationFormDefinition } from '@/registration/schemas/registry';

export function mapRegistrationApplicationGql(
  doc: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!doc) return null;
  const membershipTypeId = String(doc.membershipTypeId ?? '');
  const schemaVersion = String(doc.schemaVersion ?? '');
  const def = getRegistrationFormDefinition(membershipTypeId, schemaVersion);
  return {
    ...doc,
    membershipTypeTitle: def?.title ?? membershipTypeId,
  };
}

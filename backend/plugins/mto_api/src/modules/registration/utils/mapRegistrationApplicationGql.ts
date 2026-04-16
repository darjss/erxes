import { getRegistrationFormDefinition } from '@/registration/schemas/registry';
import { IModels } from '~/connectionResolvers';

export async function mapRegistrationApplicationGql(
  models: IModels,
  doc: Record<string, unknown> | null | undefined,
): Promise<Record<string, unknown> | null> {
  if (!doc) return null;
  const membershipTypeId = String(doc.membershipTypeId ?? '');
  const schemaVersion = String(doc.schemaVersion ?? '');
  const def = await getRegistrationFormDefinition(
    models,
    membershipTypeId,
    schemaVersion,
  );
  return {
    ...doc,
    membershipTypeTitle: def?.title ?? membershipTypeId,
  };
}

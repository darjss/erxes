import { IContext, IModels } from '~/connectionResolvers';
import { RegistrationApplicationStatus } from '@/registration/@types/registrationApplication';
import { getRegistrationFormDefinition } from '@/registration/schemas/registry';
import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { validateRegistrationAnswers } from '@/registration/utils/validateRegistrationAnswers';

export const ALLOWED_APPLICATION_STATUSES: RegistrationApplicationStatus[] = [
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
];

export function toPlainRegistrationDoc(
  doc: { toObject?: () => Record<string, unknown> } | Record<string, unknown>,
): Record<string, unknown> {
  return typeof (doc as { toObject?: () => Record<string, unknown> }).toObject ===
    'function'
    ? (doc as { toObject: () => Record<string, unknown> }).toObject()
    : (doc as Record<string, unknown>);
}

export function normalizeAnswersRecord(
  answers: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (answers && typeof answers === 'object' && !Array.isArray(answers)) {
    return answers as Record<string, unknown>;
  }
  return {};
}

export async function loadRegistrationDefinitionOrThrow(
  models: IModels,
  membershipTypeId: string,
  schemaVersion: string,
): Promise<RegistrationFormDefinition> {
  const resolved = await getRegistrationFormDefinition(
    models,
    membershipTypeId,
    schemaVersion,
  );
  if (!resolved) {
    throw new Error('Registration form definition not found');
  }
  return resolved;
}

export function validateAnswersOrThrow(
  definition: RegistrationFormDefinition,
  answers: Record<string, unknown>,
): void {
  const validation = validateRegistrationAnswers(definition, answers);
  if (!validation.valid) {
    throw new Error(validation.errors.join('; '));
  }
}

export function assertApplicationInstanceMatches(
  existing: { instanceId?: string },
  requestInstanceId?: string,
): void {
  if (
    requestInstanceId &&
    existing.instanceId &&
    existing.instanceId !== requestInstanceId
  ) {
    throw new Error('Application not found');
  }
}

export function assertCpUserOwnsApplication(
  cpUser: { _id: string } | undefined,
  existing: { cpUserId?: string | null },
): void {
  if (!cpUser?._id) return;
  const ownerId = existing.cpUserId ? String(existing.cpUserId) : undefined;
  if (!ownerId || ownerId !== String(cpUser._id)) {
    throw new Error('Application not found');
  }
}

export interface StaffCpLinkPatchArgs {
  cpUserId?: string | null;
}

export function resolveStaffCpLinkPatches(
  args: StaffCpLinkPatchArgs,
): {
  cpUserIdPatch?: string | null;
} {
  let cpUserIdPatch: string | null | undefined;

  if (args.cpUserId !== undefined) {
    cpUserIdPatch =
      args.cpUserId === null || args.cpUserId === ''
        ? null
        : String(args.cpUserId);
  }
  return { cpUserIdPatch };
}

export function parseNextStatusOrThrow(
  status: string | null | undefined,
): RegistrationApplicationStatus | undefined {
  if (status === undefined || status === null || status === '') {
    return undefined;
  }
  if (!ALLOWED_APPLICATION_STATUSES.includes(status as RegistrationApplicationStatus)) {
    throw new Error('Invalid status');
  }
  return status as RegistrationApplicationStatus;
}

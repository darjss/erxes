import { IContext } from '~/connectionResolvers';
import { RegistrationApplicationStatus } from '@/registration/@types/registrationApplication';

const CLIENT_PORTAL_ALLOWED_STATUS_UPDATES: RegistrationApplicationStatus[] = [
  'draft',
  'submitted',
];

export function assertErxesUser(context: IContext): void {
  if (!context.user?._id) {
    throw new Error('Unauthorized');
  }
}

export function assertClientPortalUser(context: IContext): void {
  if (!context.cpUser?._id) {
    throw new Error('Unauthorized');
  }
}

function isClientPortalOnlySession(context: IContext): boolean {
  return Boolean(context.cpUser?._id && !context.user?._id);
}

export function assertClientPortalAllowedStatusUpdate(
  context: IContext,
  nextStatus: RegistrationApplicationStatus | undefined,
): void {
  if (
    !isClientPortalOnlySession(context) ||
    nextStatus === undefined ||
    CLIENT_PORTAL_ALLOWED_STATUS_UPDATES.includes(nextStatus)
  ) {
    return;
  }
  throw new Error('Forbidden');
}

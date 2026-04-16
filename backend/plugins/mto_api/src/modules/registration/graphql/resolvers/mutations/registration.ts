import { Resolver } from 'erxes-api-shared/core-types';
import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { RegistrationApplicationStatus } from '@/registration/@types/registrationApplication';
import { getRegistrationFormDefinition } from '@/registration/schemas/registry';
import { validateRegistrationAnswers } from '@/registration/utils/validateRegistrationAnswers';
import { mapRegistrationApplicationGql } from '@/registration/utils/mapRegistrationApplicationGql';

interface SubmitArgs {
  membershipTypeId: string;
  schemaVersion: string;
  answers: Record<string, unknown>;
  cpUserId?: string | null;
  clientPortalId?: string | null;
  cpUserPhone?: string | null;
}

const ALLOWED_APPLICATION_STATUSES: RegistrationApplicationStatus[] = [
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
];

interface UpdateApplicationArgs {
  _id: string;
  answers?: Record<string, unknown> | null;
  status?: string | null;
  cpUserId?: string | null;
  clientPortalId?: string | null;
  cpUserPhone?: string | null;
}

function toPlainRegistrationDoc(
  doc: { toObject?: () => Record<string, unknown> } | Record<string, unknown>,
): Record<string, unknown> {
  return typeof (doc as { toObject?: () => Record<string, unknown> }).toObject ===
    'function'
    ? (doc as { toObject: () => Record<string, unknown> }).toObject()
    : (doc as Record<string, unknown>);
}

export const registrationMutations: Record<string, Resolver> = {
  async mtoRegistrationSubmit(
    _root: undefined,
    {
      membershipTypeId,
      schemaVersion,
      answers,
      cpUserId: cpUserIdArg,
      clientPortalId: clientPortalIdArg,
      cpUserPhone: cpUserPhoneArg,
    }: SubmitArgs,
    context: IContext,
  ) {
    const { models, subdomain, instanceId } = context;

    const definition = getRegistrationFormDefinition(
      models,
      membershipTypeId,
      schemaVersion,
    );
    const resolvedDefinition = await definition;
    if (!resolvedDefinition) {
      throw new Error('Registration form definition not found');
    }

    const parsed =
      answers && typeof answers === 'object' && !Array.isArray(answers)
        ? (answers as Record<string, unknown>)
        : {};

    const validation = validateRegistrationAnswers(resolvedDefinition, parsed);
    if (!validation.valid) {
      throw new Error(validation.errors.join('; '));
    }

    const cpUser = context.cpUser;
    const clientPortalIdFromCtx =
      cpUser?.clientPortalId ?? context.clientPortal?._id;

    let cpLink: {
      cpUserId: string;
      clientPortalId?: string;
      cpUserPhone?: string;
    } | null = null;

    if (cpUser?._id) {
      cpLink = {
        cpUserId: String(cpUser._id),
        ...(clientPortalIdFromCtx
          ? { clientPortalId: String(clientPortalIdFromCtx) }
          : {}),
        ...(cpUser?.phone ? { cpUserPhone: String(cpUser.phone) } : {}),
      };
    } else {
      const id =
        cpUserIdArg !== undefined &&
        cpUserIdArg !== null &&
        String(cpUserIdArg).trim() !== ''
          ? String(cpUserIdArg).trim()
          : '';
      if (id) {
        const portalId =
          clientPortalIdArg !== undefined &&
          clientPortalIdArg !== null &&
          String(clientPortalIdArg).trim() !== ''
            ? String(clientPortalIdArg).trim()
            : undefined;
        const phone =
          cpUserPhoneArg !== undefined &&
          cpUserPhoneArg !== null &&
          String(cpUserPhoneArg).trim() !== ''
            ? String(cpUserPhoneArg).trim()
            : undefined;
        cpLink = {
          cpUserId: id,
          ...(portalId ? { clientPortalId: portalId } : {}),
          ...(phone ? { cpUserPhone: phone } : {}),
        };
      }
    }

    const created = await models.RegistrationApplication.createApplication({
      membershipTypeId,
      schemaVersion,
      status: 'submitted',
      answers: parsed,
      subdomain,
      instanceId,
      ...(cpLink
        ? {
            cpUserId: cpLink.cpUserId,
            ...(cpLink.clientPortalId
              ? { clientPortalId: cpLink.clientPortalId }
              : {}),
            ...(cpLink.cpUserPhone
              ? { cpUserPhone: cpLink.cpUserPhone }
              : {}),
          }
        : {}),
    });
    return mapRegistrationApplicationGql(models, toPlainRegistrationDoc(created));
  },

  async mtoRegistrationApplicationUpdate(
    _root: undefined,
    {
      _id,
      answers,
      status,
      cpUserId: cpUserIdArg,
      clientPortalId: clientPortalIdArg,
      cpUserPhone: cpUserPhoneArg,
    }: UpdateApplicationArgs,
    context: IContext,
  ) {
    const { models, subdomain, instanceId } = context;

    const existing = await models.RegistrationApplication.findOne({
      _id,
      subdomain,
    }).lean();

    if (!existing) {
      throw new Error('Application not found');
    }

    if (
      instanceId &&
      existing.instanceId &&
      existing.instanceId !== instanceId
    ) {
      throw new Error('Application not found');
    }

    const cpUser = context.cpUser;
    if (cpUser?._id) {
      const ownerId = existing.cpUserId
        ? String(existing.cpUserId)
        : undefined;
      if (!ownerId || ownerId !== String(cpUser._id)) {
        throw new Error('Application not found');
      }
    }

    const definition = getRegistrationFormDefinition(
      models,
      existing.membershipTypeId,
      existing.schemaVersion,
    );
    const resolvedDefinition = await definition;
    if (!resolvedDefinition) {
      throw new Error('Registration form definition not found');
    }

    let parsedAnswers: Record<string, unknown> | undefined;
    if (answers !== undefined && answers !== null) {
      const parsed =
        typeof answers === 'object' && !Array.isArray(answers)
          ? (answers as Record<string, unknown>)
          : {};
      const validation = validateRegistrationAnswers(resolvedDefinition, parsed);
      if (!validation.valid) {
        throw new Error(validation.errors.join('; '));
      }
      parsedAnswers = parsed;
    }

    let nextStatus: RegistrationApplicationStatus | undefined;
    if (status !== undefined && status !== null && status !== '') {
      if (!ALLOWED_APPLICATION_STATUSES.includes(status as RegistrationApplicationStatus)) {
        throw new Error('Invalid status');
      }
      nextStatus = status as RegistrationApplicationStatus;
    }

    let cpUserIdPatch: string | null | undefined;
    let clientPortalIdPatch: string | null | undefined;
    let cpUserPhonePatch: string | null | undefined;
    if (!context.cpUser) {
      if (cpUserIdArg !== undefined) {
        cpUserIdPatch =
          cpUserIdArg === null || cpUserIdArg === ''
            ? null
            : String(cpUserIdArg);
      }
      if (clientPortalIdArg !== undefined) {
        clientPortalIdPatch =
          clientPortalIdArg === null || clientPortalIdArg === ''
            ? null
            : String(clientPortalIdArg);
      }
      if (cpUserPhoneArg !== undefined) {
        cpUserPhonePatch =
          cpUserPhoneArg === null || cpUserPhoneArg === ''
            ? null
            : String(cpUserPhoneArg);
      }
      if (cpUserIdPatch === null) {
        clientPortalIdPatch = null;
        cpUserPhonePatch = null;
      }
    }

    if (
      parsedAnswers === undefined &&
      nextStatus === undefined &&
      cpUserIdPatch === undefined &&
      clientPortalIdPatch === undefined &&
      cpUserPhonePatch === undefined
    ) {
      throw new Error('Nothing to update');
    }

    const updated = await models.RegistrationApplication.updateApplicationById(
      _id,
      subdomain,
      {
        ...(parsedAnswers !== undefined ? { answers: parsedAnswers } : {}),
        ...(nextStatus !== undefined ? { status: nextStatus } : {}),
        ...(cpUserIdPatch !== undefined ? { cpUserId: cpUserIdPatch } : {}),
        ...(clientPortalIdPatch !== undefined
          ? { clientPortalId: clientPortalIdPatch }
          : {}),
        ...(cpUserPhonePatch !== undefined
          ? { cpUserPhone: cpUserPhonePatch }
          : {}),
      },
    );

    if (!updated) {
      throw new Error('Application not found');
    }

    return mapRegistrationApplicationGql(models, toPlainRegistrationDoc(updated));
  },
};

markResolvers(registrationMutations, {
  wrapperConfig: {
    skipPermission: true,
  },
});

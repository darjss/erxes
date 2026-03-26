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
    { membershipTypeId, schemaVersion, answers }: SubmitArgs,
    context: IContext,
  ) {
    const { models, subdomain, instanceId } = context;

    const definition = getRegistrationFormDefinition(
      membershipTypeId,
      schemaVersion,
    );
    if (!definition) {
      throw new Error('Registration form definition not found');
    }

    const parsed =
      answers && typeof answers === 'object' && !Array.isArray(answers)
        ? (answers as Record<string, unknown>)
        : {};

    const validation = validateRegistrationAnswers(definition, parsed);
    if (!validation.valid) {
      throw new Error(validation.errors.join('; '));
    }

    const created = await models.RegistrationApplication.createApplication({
      membershipTypeId,
      schemaVersion,
      status: 'submitted',
      answers: parsed,
      subdomain,
      instanceId,
    });
    return mapRegistrationApplicationGql(toPlainRegistrationDoc(created));
  },

  async mtoRegistrationApplicationUpdate(
    _root: undefined,
    { _id, answers, status }: UpdateApplicationArgs,
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

    const definition = getRegistrationFormDefinition(
      existing.membershipTypeId,
      existing.schemaVersion,
    );
    if (!definition) {
      throw new Error('Registration form definition not found');
    }

    let parsedAnswers: Record<string, unknown> | undefined;
    if (answers !== undefined && answers !== null) {
      const parsed =
        typeof answers === 'object' && !Array.isArray(answers)
          ? (answers as Record<string, unknown>)
          : {};
      const validation = validateRegistrationAnswers(definition, parsed);
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

    if (parsedAnswers === undefined && nextStatus === undefined) {
      throw new Error('Nothing to update');
    }

    const updated = await models.RegistrationApplication.updateApplicationById(
      _id,
      subdomain,
      {
        ...(parsedAnswers !== undefined ? { answers: parsedAnswers } : {}),
        ...(nextStatus !== undefined ? { status: nextStatus } : {}),
      },
    );

    if (!updated) {
      throw new Error('Application not found');
    }

    return mapRegistrationApplicationGql(toPlainRegistrationDoc(updated));
  },
};

markResolvers(registrationMutations, {
  wrapperConfig: {
    skipPermission: true,
  },
});

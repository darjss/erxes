import { Resolver } from 'erxes-api-shared/core-types';
import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { assertClientPortalAllowedStatusUpdate } from '@/registration/graphql/utils/registrationAuth';
import {
  assertApplicationInstanceMatches,
  assertCpUserOwnsApplication,
  loadRegistrationDefinitionOrThrow,
  normalizeAnswersRecord,
  parseNextStatusOrThrow,
  resolveStaffCpLinkPatches,
  toPlainRegistrationDoc,
  validateAnswersOrThrow,
} from '@/registration/graphql/utils/registrationApplicationMutations';
import { mapRegistrationApplicationGql } from '@/registration/utils/mapRegistrationApplicationGql';

interface SubmitArgs {
  membershipTypeId: string;
  schemaVersion: string;
  answers: Record<string, unknown>;
  cpUserId?: string | null;
}

interface UpdateApplicationArgs {
  _id: string;
  answers?: Record<string, unknown> | null;
  status?: string | null;
  cpUserId?: string | null;
}

function resolveSubmitCpUserId(
  context: IContext,
  cpUserIdArg?: string | null,
): string | undefined {
  if (context.cpUser?._id !== undefined && context.cpUser?._id !== null)
    return String(context.cpUser._id);

  if (
    cpUserIdArg !== undefined &&
    cpUserIdArg !== null &&
    String(cpUserIdArg).trim() !== ''
  )
    return String(cpUserIdArg).trim();

  return undefined;
}

function parseAndValidateAnswers(
  definition: Parameters<typeof validateAnswersOrThrow>[0],
  answers: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const parsed = normalizeAnswersRecord(answers);
  validateAnswersOrThrow(definition, parsed);
  return parsed;
}

export const registrationMutations: Record<string, Resolver> = {
  async mtoRegistrationSubmit(
    _root: undefined,
    {
      membershipTypeId,
      schemaVersion,
      answers,
      cpUserId: cpUserIdArg,
    }: SubmitArgs,
    context: IContext,
  ) {
    const { models, subdomain, instanceId } = context;

    const resolvedDefinition = await loadRegistrationDefinitionOrThrow(
      models,
      membershipTypeId,
      schemaVersion,
    );

    const parsed = parseAndValidateAnswers(resolvedDefinition, answers);
    const resolvedCpUserId = resolveSubmitCpUserId(context, cpUserIdArg);

    const created = await models.RegistrationApplication.createApplication({
      membershipTypeId,
      schemaVersion,
      status: 'submitted',
      answers: parsed,
      subdomain,
      instanceId,
      ...(resolvedCpUserId ? { cpUserId: resolvedCpUserId } : {}),
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

    assertApplicationInstanceMatches(existing, instanceId);
    assertCpUserOwnsApplication(context.cpUser, existing);

    const resolvedDefinition = await loadRegistrationDefinitionOrThrow(
      models,
      existing.membershipTypeId,
      existing.schemaVersion,
    );

    const parsedAnswers =
      answers !== undefined && answers !== null
        ? parseAndValidateAnswers(resolvedDefinition, answers)
        : undefined;

    const nextStatus = parseNextStatusOrThrow(status);
    assertClientPortalAllowedStatusUpdate(context, nextStatus);

    const { cpUserIdPatch } =
      context.cpUser
        ? {}
        : resolveStaffCpLinkPatches({
            cpUserId: cpUserIdArg,
          });

    if (
      parsedAnswers === undefined &&
      nextStatus === undefined &&
      cpUserIdPatch === undefined
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

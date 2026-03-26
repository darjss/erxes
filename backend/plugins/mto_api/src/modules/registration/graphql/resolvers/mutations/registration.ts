import { Resolver } from 'erxes-api-shared/core-types';
import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { getRegistrationFormDefinition } from '@/registration/schemas/registry';
import { validateRegistrationAnswers } from '@/registration/utils/validateRegistrationAnswers';

interface SubmitArgs {
  membershipTypeId: string;
  schemaVersion: string;
  answers: Record<string, unknown>;
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

    return models.RegistrationApplication.createApplication({
      membershipTypeId,
      schemaVersion,
      status: 'submitted',
      answers: parsed,
      subdomain,
      instanceId,
    });
  },
};

markResolvers(registrationMutations, {
  wrapperConfig: {
    skipPermission: true,
  },
});

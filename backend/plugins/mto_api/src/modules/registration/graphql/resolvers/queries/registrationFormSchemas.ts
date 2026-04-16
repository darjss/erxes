import { Resolver } from 'erxes-api-shared/core-types';
import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  getAllRegistrationFormDefinitions,
  getRegistrationFormDefinition,
} from '@/registration/schemas/registry';

export const registrationFormSchemaQueries: Record<string, Resolver> = {
  async mtoRegistrationFormSchemas(
    _root: undefined,
    { membershipTypeId }: { membershipTypeId?: string },
    context: IContext,
  ) {
    const { models } = context;
    const all = await getAllRegistrationFormDefinitions(models);
    const filtered = membershipTypeId
      ? all.filter((doc) => doc.membershipTypeId === membershipTypeId)
      : all;

    const rows = await Promise.all(
      filtered.map(async (doc) => ({
        ...doc,
        applicationsCount: await models.RegistrationApplication.countDocuments({
          membershipTypeId: doc.membershipTypeId,
          schemaVersion: doc.schemaVersion,
        }),
      })),
    );

    return rows;
  },

  async mtoRegistrationFormSchema(
    _root: undefined,
    {
      membershipTypeId,
      schemaVersion,
    }: { membershipTypeId: string; schemaVersion: string },
    context: IContext,
  ) {
    const { models } = context;
    const doc = await getRegistrationFormDefinition(
      models,
      membershipTypeId,
      schemaVersion,
    );
    if (!doc) return null;

    return {
      ...doc,
      applicationsCount: await models.RegistrationApplication.countDocuments({
        membershipTypeId,
        schemaVersion,
      }),
    };
  },
};

markResolvers(registrationFormSchemaQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});

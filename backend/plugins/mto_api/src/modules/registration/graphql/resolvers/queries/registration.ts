import { Resolver } from 'erxes-api-shared/core-types';
import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  getAllRegistrationFormDefinitions,
  getRegistrationFormDefinition,
} from '@/registration/schemas/registry';

export const registrationQueries: Record<string, Resolver> = {
  async mtoRegistrationFormDefinition(
    _root: undefined,
    {
      membershipTypeId,
      version,
    }: { membershipTypeId: string; version?: string },
    _context: IContext,
  ) {
    const def = getRegistrationFormDefinition(membershipTypeId, version);
    return def ?? null;
  },

  async mtoRegistrationMembershipSummaries(
    _root: undefined,
    _args: unknown,
    _context: IContext,
  ) {
    return getAllRegistrationFormDefinitions().map((f) => ({
      membershipTypeId: f.membershipTypeId,
      title: f.title,
      schemaVersion: f.schemaVersion,
    }));
  },
};

markResolvers(registrationQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});

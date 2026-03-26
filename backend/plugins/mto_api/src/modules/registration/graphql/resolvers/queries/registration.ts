import { Resolver } from 'erxes-api-shared/core-types';
import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  getAllRegistrationFormDefinitions,
  getRegistrationFormDefinition,
} from '@/registration/schemas/registry';

function compareSchemaVersion(a: string, b: string): number {
  const ax = a.split(/[.-]/).map((p) => parseInt(p, 10) || 0);
  const bx = b.split(/[.-]/).map((p) => parseInt(p, 10) || 0);
  const len = Math.max(ax.length, bx.length);
  for (let i = 0; i < len; i++) {
    const na = ax[i] ?? 0;
    const nb = bx[i] ?? 0;
    if (na !== nb) return na - nb;
  }
  if (a !== b) return a.localeCompare(b);
  return 0;
}

export const registrationQueries: Record<string, Resolver> = {
  async mtoRegistrationFormDefinition(
    _root: undefined,
    {
      membershipTypeId,
      version,
    }: { membershipTypeId: string; version?: string },
    context: IContext,
  ) {
    const def = await getRegistrationFormDefinition(
      context.models,
      membershipTypeId,
      version,
    );
    return def ?? null;
  },

  async mtoRegistrationMembershipSummaries(
    _root: undefined,
    _args: unknown,
    context: IContext,
  ) {
    const forms = await getAllRegistrationFormDefinitions(context.models);
    const latestByMembershipType = new Map<string, (typeof forms)[number]>();
    for (const form of forms) {
      const current = latestByMembershipType.get(form.membershipTypeId);
      if (!current) {
        latestByMembershipType.set(form.membershipTypeId, form);
        continue;
      }
      if (compareSchemaVersion(form.schemaVersion, current.schemaVersion) > 0) {
        latestByMembershipType.set(form.membershipTypeId, form);
      }
    }

    return [...latestByMembershipType.values()].map((f) => ({
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

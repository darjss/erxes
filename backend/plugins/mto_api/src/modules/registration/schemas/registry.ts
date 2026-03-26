import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { IModels } from '~/connectionResolvers';
import { localCommunityForm } from './definitions/local-community';
import { tourGuideForm } from './definitions/tour-guide';
import { tourOperatorForm } from './definitions/tour-operator';
import { tourismServiceOrgForm } from './definitions/tourism-service-org';
import { touristTransportDriverForm } from './definitions/tourist-transport-driver';
import { travelAgentForm } from './definitions/travel-agent';

const DEFAULT_FORMS: RegistrationFormDefinition[] = [
  tourOperatorForm,
  localCommunityForm,
  tourGuideForm,
  tourismServiceOrgForm,
  travelAgentForm,
  touristTransportDriverForm,
];

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

export function listRegistrationMembershipTypeIds(): string[] {
  const ids = new Set<string>();
  for (const f of DEFAULT_FORMS) {
    ids.add(f.membershipTypeId);
  }
  return [...ids];
}

export async function ensureDefaultRegistrationFormSchemas(
  models: IModels,
): Promise<void> {
  for (const form of DEFAULT_FORMS) {
    await models.RegistrationFormSchema.updateOne(
      {
        membershipTypeId: form.membershipTypeId,
        schemaVersion: form.schemaVersion,
      },
      { $setOnInsert: form },
      { upsert: true },
    );
  }
}

export async function getRegistrationFormDefinition(
  models: IModels,
  membershipTypeId: string,
  version?: string,
): Promise<RegistrationFormDefinition | null> {
  await ensureDefaultRegistrationFormSchemas(models);
  const candidates = await models.RegistrationFormSchema.find({
    membershipTypeId,
  }).lean();
  if (candidates.length === 0) {
    return null;
  }
  if (version) {
    return candidates.find((f) => f.schemaVersion === version) ?? null;
  }
  return [...candidates].sort((a, b) =>
    compareSchemaVersion(b.schemaVersion, a.schemaVersion),
  )[0];
}

export async function getAllRegistrationFormDefinitions(
  models: IModels,
): Promise<RegistrationFormDefinition[]> {
  await ensureDefaultRegistrationFormSchemas(models);
  const docs = await models.RegistrationFormSchema.find({}).lean();
  return docs as unknown as RegistrationFormDefinition[];
}

export function getDefaultRegistrationFormDefinitions(): RegistrationFormDefinition[] {
  return [...DEFAULT_FORMS];
}

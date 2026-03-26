import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { localCommunityForm } from './definitions/local-community';
import { tourGuideForm } from './definitions/tour-guide';
import { tourOperatorForm } from './definitions/tour-operator';
import { tourismServiceOrgForm } from './definitions/tourism-service-org';
import { touristTransportDriverForm } from './definitions/tourist-transport-driver';
import { travelAgentForm } from './definitions/travel-agent';

const ALL_FORMS: RegistrationFormDefinition[] = [
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
  for (const f of ALL_FORMS) {
    ids.add(f.membershipTypeId);
  }
  return [...ids];
}

export function getRegistrationFormDefinition(
  membershipTypeId: string,
  version?: string,
): RegistrationFormDefinition | null {
  const candidates = ALL_FORMS.filter(
    (f) => f.membershipTypeId === membershipTypeId,
  );
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

export function getAllRegistrationFormDefinitions(): RegistrationFormDefinition[] {
  return [...ALL_FORMS];
}

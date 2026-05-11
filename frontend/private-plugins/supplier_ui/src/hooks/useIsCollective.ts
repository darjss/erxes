import { useAtomValue } from 'jotai';
import { currentOrganizationState } from 'ui-modules';

export const useIsCollective = (): boolean => {
  const org = useAtomValue(currentOrganizationState) as
    | (Record<string, unknown> & { bundle?: { type?: string } })
    | null;

  const bundle = org?.bundle || {};

  console.log('bundle', bundle);

  return bundle?.type === 'mushop-coshop';
};

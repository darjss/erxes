import { useQuery } from '@apollo/client';
import { GET_IDENTIFIERS } from '../graphql/queries';

export interface Identifier {
  _id: string;
  name: string;
  slug: string;
  kind?: 'assistant' | 'agent' | null;
  description?: string | null;
  createdUserId?: string | null;
  memberIds?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export type AssistantOrg = Identifier;

export const useIdentifiers = (kind?: 'assistant' | 'agent') => {
  const { data, loading, refetch } = useQuery(GET_IDENTIFIERS, {
    variables: { kind },
    fetchPolicy: 'network-only',
  });

  return {
    identifiers: (data?.getIdentifiers ?? []) as Identifier[],
    loading,
    refetch,
  };
};

export const useAssistantOrgs = (kind?: 'assistant' | 'agent') => {
  const { identifiers, loading, refetch } = useIdentifiers(kind);

  return {
    orgs: identifiers,
    loading,
    refetch,
  };
};

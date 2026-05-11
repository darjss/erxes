import { useMutation, useQuery } from '@apollo/client';
import { useCurrentIdentifierId } from '../../assistant-orgs/hooks/useAssistantOrg';
import { CHECK_KIMI_KEY_SET } from '../graphql/queries';
import { SET_KIMI_API_KEY } from '../graphql/mutations';

export const useKimiKeyStatus = (skip?: boolean) => {
  const identifierId = useCurrentIdentifierId();
  const { data, loading, refetch } = useQuery<{ checkKimiKeySet: boolean }>(
    CHECK_KIMI_KEY_SET,
    { variables: { identifierId }, skip, fetchPolicy: 'network-only' },
  );

  return {
    hasKey: data?.checkKimiKeySet ?? null,
    loading,
    refetch,
  };
};

export const useSetKimiKey = () => {
  const identifierId = useCurrentIdentifierId();
  const [setKimiApiKey, { loading }] = useMutation(SET_KIMI_API_KEY);

  const setKey = async (
    kimiApiKey: string,
    callbacks?: {
      onCompleted?: () => void;
      onError?: (error: Error) => void;
    },
  ) => {
    await setKimiApiKey({
      variables: { identifierId, input: { kimiApiKey } },
      context: { timeout: 0 },
      onCompleted: callbacks?.onCompleted,
      onError: callbacks?.onError,
    });
  };

  return { setKey, loading };
};

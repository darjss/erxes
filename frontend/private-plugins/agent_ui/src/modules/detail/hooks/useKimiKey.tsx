import { useMutation, useQuery } from '@apollo/client';
import { CHECK_KIMI_KEY_SET } from '../graphql/queries';
import { SET_KIMI_API_KEY } from '../graphql/mutations';

export const useKimiKeyStatus = (skip?: boolean) => {
  const { data, loading, refetch } = useQuery<{ checkKimiKeySet: boolean }>(
    CHECK_KIMI_KEY_SET,
    { skip, fetchPolicy: 'network-only' },
  );

  return {
    hasKey: data?.checkKimiKeySet ?? null,
    loading,
    refetch,
  };
};

export const useSetKimiKey = () => {
  const [setKimiApiKey, { loading }] = useMutation(SET_KIMI_API_KEY);

  const setKey = async (
    kimiApiKey: string,
    callbacks?: {
      onCompleted?: () => void;
      onError?: (error: Error) => void;
    },
  ) => {
    await setKimiApiKey({
      variables: { input: { kimiApiKey } },
      context: { timeout: 0 },
      onCompleted: callbacks?.onCompleted,
      onError: callbacks?.onError,
    });
  };

  return { setKey, loading };
};

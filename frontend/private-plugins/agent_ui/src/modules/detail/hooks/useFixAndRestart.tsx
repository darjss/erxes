import { useMutation } from '@apollo/client';
import { FIX_AND_RESTART_AGENT } from '../graphql/mutations';

export const useFixAndRestart = () => {
  const [fixAndRestart, { loading }] = useMutation(FIX_AND_RESTART_AGENT);

  const restart = async (callbacks?: {
    onCompleted?: () => void;
    onError?: (error: Error) => void;
  }) => {
    await fixAndRestart({
      onCompleted: callbacks?.onCompleted,
      onError: callbacks?.onError,
    });
  };

  return { restart, loading };
};

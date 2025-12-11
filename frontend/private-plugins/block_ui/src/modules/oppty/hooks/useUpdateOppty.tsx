import { useMutation, MutationHookOptions } from '@apollo/client';
import { UPDATE_OPPTY_MUTATION } from '@/oppty/graphql/mutations/updateOppty';
import { useToast } from 'erxes-ui';

export const useUpdateOppty = () => {
  const { toast } = useToast();
  const [_updateOppty, { loading, error }] = useMutation(UPDATE_OPPTY_MUTATION);
  const updateOppty = (options: MutationHookOptions) => {
    return _updateOppty({
      ...options,
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return { updateOppty, loading, error };
};

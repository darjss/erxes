import { useMutation } from '@apollo/client';
import { CREATE_OPPTY_MUTATION } from '@/oppty/graphql/mutations/createOppty';
import { useToast } from 'erxes-ui';

export const useCreateOppty = () => {
  const { toast } = useToast();
  const [createOpptyMutation, { loading, error }] = useMutation(
    CREATE_OPPTY_MUTATION,
    {
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Opportunity created successfully',
          variant: 'default',
        });
      },
      onError: (e) => {
        toast({
          title: 'Error',
          description: e.message,
          variant: 'destructive',
        });
      },
    },
  );

  return {
    createOppty: createOpptyMutation,
    loading,
    error,
  };
};

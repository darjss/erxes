import { useMutation } from '@apollo/client';
import { DELETE_OPPTY_MUTATION } from '@/oppty/graphql/mutations/deleteOppty';

export const useDeleteOppty = () => {
  const [removeOppty, { loading }] = useMutation(DELETE_OPPTY_MUTATION, {
    refetchQueries: ['BlockGetOpptys'],
  });

  return { removeOppty, loading };
};

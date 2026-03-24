import { useMutation } from '@apollo/client';
import { BLOCK_CREATE_NOTE } from '../graphql/activitiesMutation';

export const useBlockCreateNote = () => {
  const [blockCreateNote, { loading, error }] = useMutation(BLOCK_CREATE_NOTE, {
    refetchQueries: ['BlockGetActivities'],
  });

  return {
    blockCreateNote,
    loading,
    error,
  };
};

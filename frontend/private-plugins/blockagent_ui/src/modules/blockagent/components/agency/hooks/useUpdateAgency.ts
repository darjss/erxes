import { useMutation } from '@apollo/client';
import { UPDATE_AGENCY } from '../graphql';

export const useUpdateAgency = () => {
  const [updateAgency, { loading, error }] = useMutation(UPDATE_AGENCY);

  return { updateAgency, loading, error };
};

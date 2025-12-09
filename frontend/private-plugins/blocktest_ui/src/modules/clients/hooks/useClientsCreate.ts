import { useMutation } from '@apollo/client';
import { CREATE_CV_CLIENT } from '../graphql/cvClientsMutation';

export const useClientsCreate = () => {
  const [createClient, { loading }] = useMutation(CREATE_CV_CLIENT, {
    refetchQueries: ['GetCVClients'],
  });

  return { createClient, loading };
};

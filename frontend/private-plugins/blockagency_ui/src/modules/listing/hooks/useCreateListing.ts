import { useMutation } from '@apollo/client';
import { CREATE_LISTING } from '../graphql';

export const useCreateListing = () => {
  const [createListing, { loading, error }] = useMutation(CREATE_LISTING);

  return { createListing, loading, error };
};

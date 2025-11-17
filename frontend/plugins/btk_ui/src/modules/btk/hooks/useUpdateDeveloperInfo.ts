import { UPDATE_DEVELOPER_INFO } from '@/btk/graphql/btkMutations';
import { useMutation } from '@apollo/client';

export const useUpdateDeveloperInfo = () => {
  const [updateDeveloperInfo, { loading }] = useMutation(UPDATE_DEVELOPER_INFO);

  return { updateDeveloperInfo, loading };
};

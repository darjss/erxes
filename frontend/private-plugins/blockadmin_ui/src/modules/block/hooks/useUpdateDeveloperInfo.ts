import { useMutation } from '@apollo/client';
import { UPDATE_DEVELOPER_INFO } from '@/block/graphql/blockMutations';

export const useUpdateDeveloperInfo = () => {
  const [updateDeveloperInfo, { loading }] = useMutation(UPDATE_DEVELOPER_INFO);

  return { updateDeveloperInfo, loading };
};

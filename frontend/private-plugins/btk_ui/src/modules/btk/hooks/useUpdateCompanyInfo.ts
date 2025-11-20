import { UPDATE_Company_INFO } from '@/btk/graphql/btkMutations';
import { useMutation } from '@apollo/client';

export const useUpdateCompanyInfo = () => {
  const [updateCompanyInfo, { loading }] = useMutation(UPDATE_Company_INFO);

  return { updateCompanyInfo, loading };
};

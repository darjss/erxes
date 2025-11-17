import { BTK_REMOVE_UNIT } from '@/unit/graphql/unitMutations';
import { useMutation } from '@apollo/client';

export const useUnitRemove = () => {
  const [removeUnit, { loading, error }] = useMutation(BTK_REMOVE_UNIT);
  return { removeUnit };
};

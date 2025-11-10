import { BLOCK_REMOVE_UNIT } from '@/unit/graphql/unitMutations';
import { useMutation } from '@apollo/client';

export const useUnitRemove = () => {
  const [removeUnit, { loading, error }] = useMutation(BLOCK_REMOVE_UNIT);
  return { removeUnit };
};

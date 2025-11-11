import { useMutation } from '@apollo/client';
import { BLOCK_REMOVE_UNIT } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/graphql/unitMutations';

export const useUnitRemove = () => {
  const [removeUnit, { loading, error }] = useMutation(BLOCK_REMOVE_UNIT);
  return { removeUnit };
};

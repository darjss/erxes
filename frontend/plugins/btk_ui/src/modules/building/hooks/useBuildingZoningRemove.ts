import { useMutation } from '@apollo/client';
import { BTK_DELETE_BUILDING_ZONING } from '../graphql/buildingMutations';

export const useBuildingZoningRemove = () => {
  const [deleteBuildingZoning, { loading }] = useMutation(
    BTK_DELETE_BUILDING_ZONING,
  );

  return { deleteBuildingZoning, loading };
};

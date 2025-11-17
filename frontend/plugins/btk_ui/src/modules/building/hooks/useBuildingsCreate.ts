import { useMutation } from '@apollo/client';
import {
  BTK_CREATE_BUILDING,
  BTK_CREATE_BUILDING_ZONING,
  BTK_UPDATE_BUILDING,
} from '../graphql/buildingMutations';

export const useBuildingsCreate = () => {
  const [createBuilding, { loading }] = useMutation(BTK_CREATE_BUILDING);
  return { createBuilding, loading };
};

export const useBuildingsUpdate = () => {
  const [updateBuilding, { loading }] = useMutation(BTK_UPDATE_BUILDING);
  return { updateBuilding, loading };
};

export const useBuildingsCreateZone = () => {
  const [createBuildingZone, { loading }] = useMutation(
    BTK_CREATE_BUILDING_ZONING,
  );
  return { createBuildingZone, loading };
};

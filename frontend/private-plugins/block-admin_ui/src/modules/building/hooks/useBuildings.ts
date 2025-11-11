import { useQuery } from '@apollo/client';
import {
  BLOCK_GET_BUILDING_LIST,
  BLOCK_GET_BUILDING_ZONINGS,
} from 'frontend/private-plugins/blockadmin_ui/src/modules/building/graphql/buildingQueries';
import {
  IBuilding,
  IZoning,
} from 'frontend/private-plugins/blockadmin_ui/src/modules/building/types/buildingTypes';

export const useBuildings = ({ projectId }: { projectId: string }) => {
  const { data, loading } = useQuery<{ blockGetBuildings: IBuilding[] }>(
    BLOCK_GET_BUILDING_LIST,
    {
      variables: { project: projectId },
      skip: !projectId,
    },
  );
  return { buildings: data?.blockGetBuildings, loading };
};

export const useBuildingZonings = ({
  buildingId,
  skip,
}: {
  buildingId: string;
  skip?: boolean;
}) => {
  const { data, loading } = useQuery<{ blockGetBuildingZonings: IZoning[] }>(
    BLOCK_GET_BUILDING_ZONINGS,
    {
      variables: { building: buildingId },
      skip: !buildingId || skip,
    },
  );
  return { buildingZonings: data?.blockGetBuildingZonings, loading };
};

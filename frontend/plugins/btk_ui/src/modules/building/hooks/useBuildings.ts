import {
  BTK_GET_BUILDING_LIST,
  BTK_GET_BUILDING_ZONINGS,
} from '@/building/graphql/buildingQueries';
import { useQuery } from '@apollo/client';
import { IBuilding, IZoning } from '@/building/types/buildingTypes';

export const useBuildings = ({ projectId }: { projectId: string }) => {
  const { data, loading } = useQuery<{ btkGetBuildings: IBuilding[] }>(
    BTK_GET_BUILDING_LIST,
    {
      variables: { project: projectId },
      skip: !projectId,
    },
  );
  return { buildings: data?.btkGetBuildings, loading };
};

export const useBuildingZonings = ({
  buildingId,
  skip,
}: {
  buildingId: string;
  skip?: boolean;
}) => {
  const { data, loading } = useQuery<{ btkGetBuildingZonings: IZoning[] }>(
    BTK_GET_BUILDING_ZONINGS,
    {
      variables: { building: buildingId },
      skip: !buildingId || skip,
    },
  );
  return { buildingZonings: data?.btkGetBuildingZonings, loading };
};

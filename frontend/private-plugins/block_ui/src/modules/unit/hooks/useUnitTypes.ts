import { BLOCK_GET_UNIT_TYPES } from '@/unit/graphql/unitQueries';
import { IUnitType } from '@/unit/types/unitType';
import { useQuery } from '@apollo/client';

export const useUnitTypes = ({ project }: { project: string }) => {
  const { data, loading } = useQuery<{ blockGetUnitTypes: IUnitType[] }>(
    BLOCK_GET_UNIT_TYPES,
    {
      variables: { project },
      skip: !project,
    },
  );
  return { unitTypes: data?.blockGetUnitTypes, loading };
};

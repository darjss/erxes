import { QueryHookOptions, useQuery } from '@apollo/client';
import { BLOCK_GET_UNITS } from '@/unit/graphql/unitQueries';
import { IUnit } from '@/unit/types/unitType';

export const useUnits = (
  options?: QueryHookOptions<{ blockGetUnits: IUnit[] }>,
) => {
  const { data, loading } = useQuery<{ blockGetUnits: IUnit[] }>(
    BLOCK_GET_UNITS,
    { ...options },
  );
  return { units: data?.blockGetUnits, loading };
};

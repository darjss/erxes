import { BTK_GET_UNITS } from '@/unit/graphql/unitQueries';
import { IUnit } from '@/unit/types/unitType';
import { QueryHookOptions, useQuery } from '@apollo/client';

export const useUnits = (
  options?: QueryHookOptions<{ btkGetUnits: IUnit[] }>,
) => {
  const { data, loading } = useQuery<{ btkGetUnits: IUnit[] }>(BTK_GET_UNITS, {
    ...options,
  });
  return { units: data?.btkGetUnits, loading };
};

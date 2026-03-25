import { useQuery } from '@apollo/client';
import { GET_AGENCIES } from '../graphql';
import { IAgency } from '../types';

type TGetAgenciesResponse = {
  getBlockAdminAgencies: {
    list: IAgency[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    totalCount: number;
  };
};
type UseAgenciesResult = {
  agencies: IAgency[] | undefined;
  loading: boolean;
  error: Error | undefined;
};

export const getAgencies = (): UseAgenciesResult => {
  const { data, loading, error } = useQuery<TGetAgenciesResponse>(GET_AGENCIES);
  return { agencies: data?.getBlockAdminAgencies?.list, loading, error };
};

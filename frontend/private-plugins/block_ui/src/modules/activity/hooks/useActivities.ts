import { useQuery } from '@apollo/client';
import { ACTIVITIES_QUERY } from '../graphql/activitiesQueries';
import { IActivity } from '../types/activityTypes';

interface IActivitiesResponse {
  blockActivities: {
    list: IActivity[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    totalCount: number;
  };
}

export const useActivities = (contentId: string) => {
  const { data, loading, error, refetch } = useQuery<IActivitiesResponse>(
    ACTIVITIES_QUERY,
    {
      variables: { contentId },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    activities: data?.blockActivities?.list,
    pageInfo: data?.blockActivities?.pageInfo,
    totalCount: data?.blockActivities?.totalCount,
    loading,
    error,
    refetch,
  };
};

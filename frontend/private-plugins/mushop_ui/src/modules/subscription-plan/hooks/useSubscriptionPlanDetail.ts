import { useQuery } from '@apollo/client';
import { MUSHOP_SUBSCRIPTION_PLAN_DETAIL } from '../graphql/queries';

export const useSubscriptionPlanDetail = (_id?: string | null) => {
  const { data, loading } = useQuery(MUSHOP_SUBSCRIPTION_PLAN_DETAIL, {
    variables: { _id },
    skip: !_id,
  });

  return {
    plan: data?.mushopSubscriptionPlanDetail,
    loading,
  };
};

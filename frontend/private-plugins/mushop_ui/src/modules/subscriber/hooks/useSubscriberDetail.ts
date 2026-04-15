import { useQuery } from '@apollo/client';
import { MUSHOP_SUBSCRIPTION_DETAIL } from '../graphql/queries';
import { ISubscriber } from '../types';

export const useSubscriberDetail = (_id?: string | null) => {
  const { data, loading } = useQuery<{
    mushopSubscriptionDetail: ISubscriber;
  }>(MUSHOP_SUBSCRIPTION_DETAIL, {
    variables: { _id },
    skip: !_id,
  });

  return { subscriber: data?.mushopSubscriptionDetail, loading };
};

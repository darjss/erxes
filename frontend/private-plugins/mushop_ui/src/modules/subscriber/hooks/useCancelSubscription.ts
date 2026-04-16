import { useMutation } from '@apollo/client';
import { MUSHOP_CANCEL_SUBSCRIPTION } from '../graphql/mutations';
import { MUSHOP_SUBSCRIPTIONS } from '../graphql/queries';

export const useCancelSubscription = () => {
  const [cancelSubscription, { loading }] = useMutation(
    MUSHOP_CANCEL_SUBSCRIPTION,
    { refetchQueries: [{ query: MUSHOP_SUBSCRIPTIONS }] },
  );

  const handleCancel = (_id: string) => {
    return cancelSubscription({ variables: { _id } });
  };

  return { handleCancel, loading };
};

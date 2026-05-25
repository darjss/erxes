import { useMutation } from '@apollo/client';
import { MUSHOP_GRANT_SUBSCRIPTION } from '../graphql/mutations';
import { MUSHOP_SUBSCRIPTIONS } from '../graphql/queries';

export const useGrantSubscription = () => {
  const [grantSubscription, { loading }] = useMutation(
    MUSHOP_GRANT_SUBSCRIPTION,
    { refetchQueries: [{ query: MUSHOP_SUBSCRIPTIONS }] },
  );

  const handleGrant = (
    customerId: string,
    planId: string,
    paymentId?: string,
    amount?: number,
  ) => {
    return grantSubscription({
      variables: { customerId, planId, paymentId, amount },
    });
  };

  return { handleGrant, loading };
};

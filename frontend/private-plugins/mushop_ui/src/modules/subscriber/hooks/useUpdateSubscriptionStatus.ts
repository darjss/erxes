import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import { MUSHOP_UPDATE_SUBSCRIPTION_STATUS } from '../graphql/mutations';
import {
  MUSHOP_SUBSCRIPTIONS,
  MUSHOP_SUBSCRIPTION_DETAIL,
} from '../graphql/queries';

export const useUpdateSubscriptionStatus = () => {
  const [mutate, { loading }] = useMutation(
    MUSHOP_UPDATE_SUBSCRIPTION_STATUS,
    {
      onCompleted: () => toast({ title: 'Status updated' }),
      onError: (e) =>
        toast({
          title: 'Error',
          description: e.message,
          variant: 'destructive',
        }),
    },
  );

  const updateStatus = (_id: string, status: string) =>
    mutate({
      variables: { _id, status },
      refetchQueries: [
        { query: MUSHOP_SUBSCRIPTIONS },
        { query: MUSHOP_SUBSCRIPTION_DETAIL, variables: { _id } },
      ],
    });

  return { updateStatus, loading };
};

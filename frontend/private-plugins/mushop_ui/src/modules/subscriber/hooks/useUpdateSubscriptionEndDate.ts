import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import { MUSHOP_UPDATE_SUBSCRIPTION_END_DATE } from '../graphql/mutations';
import {
  MUSHOP_SUBSCRIPTIONS,
  MUSHOP_SUBSCRIPTION_DETAIL,
} from '../graphql/queries';

export const useUpdateSubscriptionEndDate = () => {
  const [mutate, { loading }] = useMutation(
    MUSHOP_UPDATE_SUBSCRIPTION_END_DATE,
    {
      onCompleted: () => toast({ title: 'End date updated' }),
      onError: (e) =>
        toast({
          title: 'Error',
          description: e.message,
          variant: 'destructive',
        }),
    },
  );

  const updateEndDate = (_id: string, endDate: Date) =>
    mutate({
      variables: { _id, endDate },
      refetchQueries: [
        { query: MUSHOP_SUBSCRIPTIONS },
        { query: MUSHOP_SUBSCRIPTION_DETAIL, variables: { _id } },
      ],
    });

  return { updateEndDate, loading };
};

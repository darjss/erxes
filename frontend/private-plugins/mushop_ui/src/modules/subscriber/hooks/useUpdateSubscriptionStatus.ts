import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import { useTranslation } from 'react-i18next';
import { MUSHOP_UPDATE_SUBSCRIPTION_STATUS } from '../graphql/mutations';
import {
  MUSHOP_SUBSCRIPTIONS,
  MUSHOP_SUBSCRIPTION_DETAIL,
} from '../graphql/queries';

export const useUpdateSubscriptionStatus = () => {
  const { t } = useTranslation('mushop');
  const [mutate, { loading }] = useMutation(
    MUSHOP_UPDATE_SUBSCRIPTION_STATUS,
    {
      onCompleted: () => toast({ title: t('Status updated') }),
      onError: (e) =>
        toast({
          title: t('Error'),
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

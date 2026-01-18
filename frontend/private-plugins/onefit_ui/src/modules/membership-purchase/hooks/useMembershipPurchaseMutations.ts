import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import {
  ONE_FIT_MEMBERSHIP_PURCHASE_ACTIVATE,
  ONE_FIT_MEMBERSHIP_PURCHASE_CREATE,
} from '../graphql/membershipPurchaseMutations';
import { ONE_FIT_MEMBERSHIP_PURCHASES } from '../graphql/membershipPurchaseQueries';

export function useCreateMembershipPurchase() {
  const [createMembershipPurchaseMutation, { loading }] = useMutation(
    ONE_FIT_MEMBERSHIP_PURCHASE_CREATE,
  );

  function createMembershipPurchase(options: MutationFunctionOptions) {
    return createMembershipPurchaseMutation({
      ...options,
      refetchQueries: [{ query: ONE_FIT_MEMBERSHIP_PURCHASES }],
      onCompleted: (data) => {
        options.onCompleted?.(data);
        toast({
          title: 'Success',
          description: 'Membership purchase created successfully',
        });
      },
      onError: (error) => {
        options.onError?.(error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  }

  return { createMembershipPurchase, loading };
}

export function useActivateMembershipPurchase() {
  const [activateMembershipPurchaseMutation, { loading }] = useMutation(
    ONE_FIT_MEMBERSHIP_PURCHASE_ACTIVATE,
  );

  function activateMembershipPurchase(options: MutationFunctionOptions) {
    return activateMembershipPurchaseMutation({
      ...options,
      refetchQueries: [{ query: ONE_FIT_MEMBERSHIP_PURCHASES }],
      onCompleted: (data) => {
        options.onCompleted?.(data);
        toast({
          title: 'Success',
          description: 'Membership activated successfully',
        });
      },
      onError: (error) => {
        options.onError?.(error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  }

  return { activateMembershipPurchase, loading };
}


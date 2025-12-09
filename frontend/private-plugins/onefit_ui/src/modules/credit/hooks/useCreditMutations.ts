import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import {
  ONE_FIT_CREDIT_TRANSACTIONS_REMOVE,
  ONE_FIT_CREDIT_TRANSACTION_CREATE,
} from '../graphql/creditMutations';
import { ONE_FIT_CREDIT_TRANSACTIONS } from '../graphql/creditQueries';

export function useRemoveCreditTransactions() {
  const [removeCreditTransactionsMutation, { loading }] = useMutation(
    ONE_FIT_CREDIT_TRANSACTIONS_REMOVE,
  );

  const removeCreditTransactions = (ids: string[]) => {
    return removeCreditTransactionsMutation({
      variables: { ids },
      refetchQueries: [{ query: ONE_FIT_CREDIT_TRANSACTIONS }],
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Credit transactions removed successfully',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return { removeCreditTransactions, loading };
}

export function useCreateCreditTransaction() {
  const [createCreditTransactionMutation, { loading }] = useMutation(
    ONE_FIT_CREDIT_TRANSACTION_CREATE,
  );

  const createCreditTransaction = (options: MutationFunctionOptions) => {
    return createCreditTransactionMutation({
      ...options,
      refetchQueries: [{ query: ONE_FIT_CREDIT_TRANSACTIONS }],
      onCompleted: (data) => {
        options.onCompleted?.(data);
        toast({
          title: 'Success',
          description: 'Credit transaction created successfully',
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
  };

  return { createCreditTransaction, loading };
}


import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import { SUBMIT_PRODUCTS_BULK, RESUBMIT_PRODUCT_TO_PLATFORM } from '../graphql/mutations';
import { PLATFORM_SUBMISSIONS } from '../graphql/queries';

const refetchQueries = [{ query: PLATFORM_SUBMISSIONS }];

export const useSubmissionMutations = () => {
  const [submitBulk, { loading: submittingBulk }] = useMutation(SUBMIT_PRODUCTS_BULK, {
    refetchQueries,
    onCompleted: (data) =>
      toast({ title: `${data.supplierSubmitProductsBulk?.length ?? 0} product(s) submitted` }),
    onError: (err) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const [resubmitProduct, { loading: resubmitting }] = useMutation(
    RESUBMIT_PRODUCT_TO_PLATFORM,
    {
      refetchQueries,
      onCompleted: () => toast({ title: 'Product resubmitted' }),
      onError: (err) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
    },
  );

  return { submitBulk, resubmitProduct, submittingBulk, resubmitting };
};

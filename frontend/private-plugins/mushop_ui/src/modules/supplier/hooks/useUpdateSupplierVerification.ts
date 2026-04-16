import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import { MUSHOP_UPDATE_SUPPLIER_VERIFICATION_STATUS } from '../graphql/mutations';
import { MUSHOP_SUPPLIERS } from '../graphql/queries';

export const useUpdateSupplierVerification = () => {
  const [mutate, { loading }] = useMutation(
    MUSHOP_UPDATE_SUPPLIER_VERIFICATION_STATUS,
    {
      refetchQueries: [{ query: MUSHOP_SUPPLIERS }],
      onCompleted: () => toast({ title: 'Verification status updated' }),
      onError: (e) =>
        toast({ title: 'Error', description: e.message, variant: 'destructive' }),
    },
  );

  const updateVerification = (_id: string, verificationStatus: string) =>
    mutate({ variables: { _id, verificationStatus } });

  return { updateVerification, loading };
};

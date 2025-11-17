import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { BTK_CREATE_UNIT } from '@/unit/graphql/unitMutations';
import { BTK_GET_UNITS } from '@/unit/graphql/unitQueries';
import { toast } from 'erxes-ui';

export const useUnitCreate = ({ zoning }: { zoning: string }) => {
  const [mutate, { loading }] = useMutation(BTK_CREATE_UNIT);

  const createUnit = (options: MutationFunctionOptions) => {
    mutate({
      ...options,
      refetchQueries: [
        {
          query: BTK_GET_UNITS,
          variables: { zoning },
        },
      ],
      onCompleted: (data) => {
        options.onCompleted?.(data);
        toast({
          title: 'Success',
          description: 'Unit created successfully',
          variant: 'default',
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

  return { createUnit, loading };
};

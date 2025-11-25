import { useMutation } from '@apollo/client';
import { CREATE_CONTRACT, UPDATE_CONTRACT } from '../graphql/contractMutations';
import { IContractInput } from '../types/contractTypes';
import { GET_CONTRACTS } from '../graphql/contractQueries';
import { useQueryState } from 'erxes-ui';

export function useCreateContract() {
  const [unitId] = useQueryState<string>('unitId');
  const [createContract, { loading, error }] = useMutation(CREATE_CONTRACT, {
    refetchQueries: [{ query: GET_CONTRACTS, variables: { unit: unitId } }],
  });

  return {
    createContract,
    loading,
    error,
  };
}

export function useUpdateContract() {
  const [updateContract, { loading, error }] = useMutation(UPDATE_CONTRACT, {
    refetchQueries: [{ query: GET_CONTRACTS }],
  });

  const handleUpdate = async (id: string, input: IContractInput) => {
    const { data } = await updateContract({
      variables: { id, input },
    });
    return data?.blockUpdateContract;
  };

  return {
    updateContract: handleUpdate,
    loading,
    error,
  };
}

import { useMutation } from '@apollo/client';
import { UPDATE_PROJECT_GENERAL_INFO } from '../graphql/projectMutations';
import { IProjectGeneralInput } from '../types/projectTypes';
import { toast } from 'erxes-ui';

export const useUpdateProjectGeneralInfo = () => {
  const [updateProjectGeneralInfoMutation] = useMutation(
    UPDATE_PROJECT_GENERAL_INFO,
  );

  const updateProjectGeneralInfo = (
    id: string,
    input: Partial<IProjectGeneralInput>,
  ) => {
    updateProjectGeneralInfoMutation({
      variables: { id, input },
      update: (cache, { data: { btkUpdateProjectGeneralInfo } }) => {
        cache.modify({
          id: cache.identify(btkUpdateProjectGeneralInfo),
          fields: Object.keys(input).reduce(
            (fields: Record<string, () => any>, field) => {
              fields[field] = () => input[field as keyof IProjectGeneralInput];
              return fields;
            },
            {},
          ),
          optimistic: true,
        });
      },
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Project updated successfully',
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

  return { updateProjectGeneralInfo };
};

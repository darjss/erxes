import { BTK_UPDATE_UNIT } from '@/unit/graphql/unitMutations';
import { IUnit } from '@/unit/types/unitType';
import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';

export const useUnitUpdate = ({ id }: { id: string }) => {
  const [mutate] = useMutation(BTK_UPDATE_UNIT);
  const updateUnit = (input: Partial<IUnit>) => {
    mutate({
      variables: { id, input },
      update: (cache, { data: { btkUpdateUnit } }) => {
        cache.modify({
          id: cache.identify(btkUpdateUnit),
          fields: Object.keys(input).reduce(
            (fields: Record<string, () => any>, field) => {
              fields[field] = () => input[field as keyof IUnit];
              return fields;
            },
            {},
          ),
        });
      },
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Unit updated successfully',
        });
      },
    });
  };
  return { updateUnit };
};

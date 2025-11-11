import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import { BLOCK_UPDATE_UNIT } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/graphql/unitMutations';
import { IUnit } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/types/unitType';

export const useUnitUpdate = ({ id }: { id: string }) => {
  const [mutate] = useMutation(BLOCK_UPDATE_UNIT);
  const updateUnit = (input: Partial<IUnit>) => {
    mutate({
      variables: { id, input },
      update: (cache, { data: { blockUpdateUnit } }) => {
        cache.modify({
          id: cache.identify(blockUpdateUnit),
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

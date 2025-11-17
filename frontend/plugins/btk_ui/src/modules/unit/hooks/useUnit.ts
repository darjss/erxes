import { useQuery } from '@apollo/client';
import { BTK_GET_UNIT, BTK_UNIT_ATTACHMENTS } from '../graphql/unitQueries';

export const useUnit = (id?: string | null) => {
  const { data, loading } = useQuery(BTK_GET_UNIT, {
    variables: { id },
    skip: !id,
  });
  return { unit: data?.btkGetUnit, loading };
};

export const useUnitAttachments = (id?: string | null) => {
  const { data, loading } = useQuery(BTK_UNIT_ATTACHMENTS, {
    variables: { itemType: 'unit', itemId: id },
    skip: !id,
  });
  return { attachments: data?.btkGetAttachments, loading };
};

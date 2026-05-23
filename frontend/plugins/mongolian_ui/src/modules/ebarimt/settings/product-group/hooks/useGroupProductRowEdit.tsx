import { useMutation } from '@apollo/client';
import { EBARIMT_PRODUCT_GROUP_EDIT } from '@/ebarimt/settings/product-group/graphql/mutations/productGroupMutations';
import { GET_PRODUCT_GROUP } from '@/ebarimt/settings/product-group/graphql/queries/getProductGroup';
import { PRODUCT_GROUP_ROW_DEFAULT_VARIABLES } from '@/ebarimt/settings/product-group/constants/productGroupRowDefaultVariables';
import { toast } from 'erxes-ui';
import { useTranslation } from 'react-i18next';

export const useGroupProductRowEdit = () => {
  const { t } = useTranslation('mongolian');
  const [editGroupProductRow, { loading }] = useMutation(
    EBARIMT_PRODUCT_GROUP_EDIT,
    {
      refetchQueries: [
        {
          query: GET_PRODUCT_GROUP,
          variables: PRODUCT_GROUP_ROW_DEFAULT_VARIABLES,
        },
      ],
      awaitRefetchQueries: true,
      onError: (error) => {
        toast({
          title: t('error'),
          description: error.message || t('failed-to-update-product-group'),
          variant: 'destructive',
        });
      },
    },
  );

  return {
    editGroupProductRow,
    loading,
  };
};

'use client';

import {
  MutationHookOptions,
  useApolloClient,
  useMutation,
} from '@apollo/client';
import { useQueryState, useToast } from 'erxes-ui';
import { useTranslation } from 'react-i18next';

import { DEALS_EDIT_PRODUCT_DATA } from '@/deals/cards/components/detail/product/graphql/mutations/ProductsActions';

export const useDealsEditProductData = (options?: MutationHookOptions) => {
  const { toast } = useToast();
  const { t } = useTranslation('sales');
  const [salesItemId] = useQueryState('salesItemId');
  const client = useApolloClient();

  const [editDealsProductData, { loading, error }] = useMutation(
    DEALS_EDIT_PRODUCT_DATA,
    {
      ...options,
      onCompleted: (data) => {
        toast({
          title: t('success'),
          variant: 'success',
        });
        const nextProductsData = data.dealsEditProductData.productsData;

        // Update Apollo cache manually
        client.cache.modify({
          id: client.cache.identify({
            _id: salesItemId as string,
            __typename: 'Deal',
          }),
          fields: {
            products(existingProducts = []) {
              return [...existingProducts, ...nextProductsData];
            },
          },
        });

        options?.onCompleted?.(data);
      },
      onError: (e) => {
        toast({
          title: t('error'),
          description: e.message,
          variant: 'destructive',
        });
        options?.onError?.(e);
      },
    },
  );
  return {
    editDealsProductData,
    loading,
    error,
  };
};

import { useQuery } from '@apollo/client';
import { useMultiQueryState } from 'erxes-ui';
import { MUSHOP_PRODUCTS, MUSHOP_PRODUCTS_TOTAL_COUNT } from '../graphql/queries';
import { IMushopProduct } from '../types';

export const useMushopProductVariables = () => {
  const [{ searchValue, status, supplierId, categoryId }] =
    useMultiQueryState<{
      searchValue: string;
      status: string;
      supplierId: string;
      categoryId: string;
    }>(['searchValue', 'status', 'supplierId', 'categoryId']);

  return {
    searchValue: searchValue || undefined,
    status: status || undefined,
    supplierId: supplierId || undefined,
    categoryId: categoryId || undefined,
  };
};

export const useMushopProducts = (page = 1, perPage = 20) => {
  const variables = useMushopProductVariables();

  const { data, loading } = useQuery<{
    mushopProducts: IMushopProduct[];
  }>(MUSHOP_PRODUCTS, {
    variables: { ...variables, page, perPage },
  });

  const { data: countData } = useQuery<{
    mushopProductsTotalCount: number;
  }>(MUSHOP_PRODUCTS_TOTAL_COUNT, {
    variables,
  });

  return {
    products: data?.mushopProducts || [],
    loading,
    totalCount: countData?.mushopProductsTotalCount || 0,
  };
};

import { useMutation, useQuery } from '@apollo/client';
import { MUSHOP_ASSIGN_PRODUCT_CATEGORY } from '../graphql/mutations';
import { PRODUCT_CATEGORIES } from '../graphql/queries';
import { IMushopProductCategory } from '../types';

export const useCoreProductCategories = (_searchValue?: string) => {
  const { data, loading } = useQuery(PRODUCT_CATEGORIES);

  const categories: IMushopProductCategory[] =
    data?.productCategories || [];

  return { categories, loading };
};

export const useAssignProductCategory = () => {
  const [assign, { loading }] = useMutation(MUSHOP_ASSIGN_PRODUCT_CATEGORY, {
    refetchQueries: ['MushopProductDetail'],
  });

  return { assign, loading };
};

import { useMutation, useQuery } from '@apollo/client';
import { MUSHOP_ASSIGN_PRODUCT_CATEGORY } from '../graphql/mutations';
import { MUSHOP_CORE_PRODUCT_CATEGORIES } from '../graphql/queries';
import { IMushopProductCategory } from '../types';

export const useCoreProductCategories = (searchValue?: string) => {
  const { data, loading } = useQuery(MUSHOP_CORE_PRODUCT_CATEGORIES, {
    variables: { searchValue },
  });

  const categories: IMushopProductCategory[] =
    data?.mushopCoreProductCategories || [];

  return { categories, loading };
};

export const useAssignProductCategory = () => {
  const [assign, { loading }] = useMutation(MUSHOP_ASSIGN_PRODUCT_CATEGORY, {
    refetchQueries: ['MushopProductDetail'],
  });

  return { assign, loading };
};

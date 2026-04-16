import { QueryHookOptions, useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  mergeCursorData,
  parseDateRangeFromString,
  useMultiQueryState,
  validateFetchMore,
} from 'erxes-ui';
import { MUSHOP_SUPPLIERS } from '../graphql/queries';
import { ISupplierList } from '../types';

export const useSupplierVariables = (
  variables?: QueryHookOptions['variables'],
) => {
  const [{ searchValue, created, foundedAt, city, district, status }] =
    useMultiQueryState<{
      searchValue: string;
      created: string;
      foundedAt: string;
      city: string;
      district: string;
      status: string;
    }>(['searchValue', 'created', 'foundedAt', 'city', 'district', 'status']);

  const dateFilters: Record<string, any> = {};

  if (created) {
    dateFilters.createdAt = {
      gte: parseDateRangeFromString(created)?.from,
      lte: parseDateRangeFromString(created)?.to,
    };
  }

  if (foundedAt) {
    dateFilters.dateFounded = {
      gte: parseDateRangeFromString(foundedAt)?.from,
      lte: parseDateRangeFromString(foundedAt)?.to,
    };
  }

  return {
    ...(variables || {}),
    searchValue: searchValue || undefined,
    city: city || undefined,
    district: district || undefined,
    dateFilters: Object.keys(dateFilters)?.length ? JSON.stringify(dateFilters) : undefined,
    verificationStatus: status || undefined,
  };
};

export const useSuppliers = (options?: QueryHookOptions) => {
  const variables = useSupplierVariables(options?.variables);

  const { data, loading, fetchMore } = useQuery<{
    mushopSuppliers: ISupplierList;
  }>(MUSHOP_SUPPLIERS, { ...options, variables });

  const { list: suppliers, pageInfo, totalCount } = data?.mushopSuppliers || {};

  const handleFetchMore = (
    direction: EnumCursorDirection = EnumCursorDirection.FORWARD,
  ) => {
    if (!validateFetchMore({ direction, pageInfo })) return;

    fetchMore({
      variables: {
        ...variables,
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: 20,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          mushopSuppliers: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.mushopSuppliers,
            prevResult: prev.mushopSuppliers,
          }),
        });
      },
    });
  };

  return { suppliers, loading, pageInfo, totalCount, handleFetchMore };
};

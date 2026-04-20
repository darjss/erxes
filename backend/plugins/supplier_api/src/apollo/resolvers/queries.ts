import { supplierQueries } from '@/supplier/graphql/resolvers/queries/supplier';
import { submissionQueries } from '@/platform/graphql/resolvers/queries/submission';

export const queries = {
  ...supplierQueries,
  ...submissionQueries,
};

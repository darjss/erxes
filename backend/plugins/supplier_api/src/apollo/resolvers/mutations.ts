import { supplierMutations } from '@/supplier/graphql/resolvers/mutations/supplier';
import { submissionMutations } from '@/platform/graphql/resolvers/mutations/submission';

export const mutations = {
  ...supplierMutations,
  ...submissionMutations,
};

import { supplierMutations } from '@/supplier/graphql/resolvers/mutations/supplier';
import { submissionMutations } from '@/platform/graphql/resolvers/mutations/submission';

// These mutations are wrapped by wrapMutationResolver — auto-sends supplier webhook
export const WrappedMutation = {
  ...supplierMutations,
};

// These mutations handle their own webhooks manually — must NOT be wrapped
export const DirectMutation = {
  ...submissionMutations,
};

export const mutations = {
  ...WrappedMutation,
  ...DirectMutation,
};

import { developerMutations } from '@/developer/graphql/resolvers/mutations/developer';
import { submissionMutation } from '@/form/graphql/mutations';

export const mutations = {
  ...submissionMutation,
  ...developerMutations,
};

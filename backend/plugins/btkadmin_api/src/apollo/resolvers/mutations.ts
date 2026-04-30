import { submissionMutation } from '@/form/graphql/mutations';
import { companyMutations } from '~/modules/company/graphql/resolvers/mutations/company';
import { newsMutations } from '~/modules/news/graphql/resolvers/mutations/news';

export const mutations = {
  ...submissionMutation,
  ...companyMutations,
  ...newsMutations,
};

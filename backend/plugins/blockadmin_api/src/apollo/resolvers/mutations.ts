import { agencyMutations } from '@/agency/graphql/resolvers/mutations/agency';
import { developerMutations } from '@/developer/graphql/resolvers/mutations/developer';
import { submissionMutation } from '@/form/graphql/mutations';
import { unitMutations } from '@/unit/graphql/resolvers/mutations/unit';
import { projectMutations } from '@/project/graphql/resolvers/mutations/project';

export const mutations = {
  ...submissionMutation,
  ...agencyMutations,
  ...developerMutations,
  ...unitMutations,
  ...projectMutations,
};

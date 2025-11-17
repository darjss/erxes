import { projectMutations } from '@/project/graphql/resolvers/mutations/project';
import { paymentMutations } from '@/project/graphql/resolvers/mutations/payment';
import { attachmentMutations } from '@/attachment/graphql/resolvers/mutations/attachment';
import { documentMutations } from '@/document/graphql/resolvers/mutations/document';
import { companyMutations } from '@/company/graphql/resolvers/mutations/company';

import { projectMemberMutations } from '@/project/graphql/resolvers/mutations/member';

export const mutations = {
  ...projectMutations,
  ...paymentMutations,
  ...attachmentMutations,
  ...documentMutations,
  ...companyMutations,
  ...projectMemberMutations,
};

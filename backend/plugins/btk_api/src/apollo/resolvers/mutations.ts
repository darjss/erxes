import { newsMutations } from '~/modules/news/graphql/resolvers/mutations/news';
import { paymentMutations } from '~/modules/news/graphql/resolvers/mutations/payment';
import { attachmentMutations } from '@/attachment/graphql/resolvers/mutations/attachment';
import { documentMutations } from '@/document/graphql/resolvers/mutations/document';
import { companyMutations } from '@/company/graphql/resolvers/mutations/company';
import { newsMemberMutations } from '~/modules/news/graphql/resolvers/mutations/member';

export const mutations = {
  ...newsMutations,
  ...paymentMutations,
  ...attachmentMutations,
  ...documentMutations,
  ...companyMutations,
  ...newsMemberMutations,
};

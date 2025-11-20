import { newsQueries } from '~/modules/news/graphql/resolvers/queries/news';
import { paymentQueries } from '~/modules/news/graphql/resolvers/queries/payment';
import { attachmentQueries } from '@/attachment/graphql/resolvers/queries/attachment';
import { documentQueries } from '@/document/graphql/resolvers/queries/document';
import { companyQueries } from '@/company/graphql/resolvers/queries/company';
import { newsMemberQueries } from '~/modules/news/graphql/resolvers/queries/member';

export const queries = {
  ...newsQueries,
  ...paymentQueries,
  ...attachmentQueries,
  ...documentQueries,
  ...companyQueries,
  ...newsMemberQueries,
};

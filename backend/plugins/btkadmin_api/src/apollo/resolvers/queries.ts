import { attachmentQueries } from '@/attachment/graphql/resolvers/queries/attachment';
import { companyQueries } from '~/modules/company/graphql/resolvers/queries/company';
import { documentQueries } from '@/document/graphql/resolvers/queries/document';
import { newsMemberQueries } from '~/modules/news/graphql/resolvers/queries/member';
import { paymentQueries } from '~/modules/news/graphql/resolvers/queries/payment';
import { newsQueries } from '~/modules/news/graphql/resolvers/queries/news';

import { cpBtkQueries } from '~/modules/clientportal/graphql/resolvers/queries';

export const queries = {
  ...newsQueries,
  ...paymentQueries,
  ...attachmentQueries,
  ...documentQueries,
  ...companyQueries,
  ...newsMemberQueries,
  ...cpBtkQueries,
};

import { projectQueries } from '@/project/graphql/resolvers/queries/project';
import { paymentQueries } from '@/project/graphql/resolvers/queries/payment';
import { attachmentQueries } from '@/attachment/graphql/resolvers/queries/attachment';
import { documentQueries } from '@/document/graphql/resolvers/queries/document';
import { companyQueries } from '@/company/graphql/resolvers/queries/company';
import { projectMemberQueries } from '@/project/graphql/resolvers/queries/member';

export const queries = {
  ...projectQueries,
  ...paymentQueries,
  ...attachmentQueries,
  ...documentQueries,
  ...companyQueries,
  ...projectMemberQueries,
};

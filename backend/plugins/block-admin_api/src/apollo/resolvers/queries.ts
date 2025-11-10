import { projectQueries } from '@/project/graphql/resolvers/queries/project';
import { buildingQueries } from '@/building/graphql/resolvers/queries/building';
import { zoningQueries } from '@/building/graphql/resolvers/queries/zoning';
import { paymentQueries } from '@/project/graphql/resolvers/queries/payment';
import { attachmentQueries } from '@/attachment/graphql/resolvers/queries/attachment';
import { documentQueries } from '@/document/graphql/resolvers/queries/document';
import { developerQueries } from '@/developer/graphql/resolvers/queries/developer';
import { unitQueries } from '@/unit/graphql/resolvers/queries/unit';
import { unitLeadQueries } from '@/unit/graphql/resolvers/queries/unitLead';
import { projectMemberQueries } from '@/project/graphql/resolvers/queries/member';
import { contractQueries } from '@/contract/graphql/resolvers/queries/contract';
import { offerQueries } from '@/contract/graphql/resolvers/queries/offer';
import { invoiceQueries } from '@/invoice/graphql/resolvers/queries/invoice';

export const queries = {
  ...projectQueries,
  ...buildingQueries,
  ...zoningQueries,
  ...paymentQueries,
  ...attachmentQueries,
  ...documentQueries,
  ...developerQueries,
  ...unitQueries,
  ...projectMemberQueries,
  ...unitLeadQueries,
  ...contractQueries,
  ...offerQueries,
  ...invoiceQueries,
};

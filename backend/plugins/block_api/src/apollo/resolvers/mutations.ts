import { projectMutations } from '@/project/graphql/resolvers/mutations/project';
import { buildingMutations } from '@/building/graphql/resolvers/mutations/building';
import { zoningMutations } from '@/building/graphql/resolvers/mutations/zoning';
import { paymentMutations } from '@/project/graphql/resolvers/mutations/payment';
import { attachmentMutations } from '@/attachment/graphql/resolvers/mutations/attachment';
import { documentMutations } from '@/document/graphql/resolvers/mutations/document';
import { developerMutations } from '@/developer/graphql/resolvers/mutations/developer';
import { unitMutations } from '@/unit/graphql/resolvers/mutations/unit';
import { unitLeadMutations } from '@/unit/graphql/resolvers/mutations/unitLead';
import { projectMemberMutations } from '@/project/graphql/resolvers/mutations/member';
import { contractMutations } from '@/contract/graphql/resolvers/mutations/contract';
import { offerMutations } from '@/contract/graphql/resolvers/mutations/offer';
import { invoiceMutations } from '@/invoice/graphql/resolvers/mutations/invoice';
import { unitTypesMutations } from '~/modules/unit/graphql/resolvers/mutations/unitType';
import { opptyMutations } from '@/oppty/graphql/mutations/oppty';
import { statusMutations } from '@/status/graphql/mutations/status';

export const mutations = {
  ...projectMutations,
  ...buildingMutations,
  ...zoningMutations,
  ...paymentMutations,
  ...attachmentMutations,
  ...documentMutations,
  ...developerMutations,
  ...unitMutations,
  ...projectMemberMutations,
  ...unitLeadMutations,
  ...contractMutations,
  ...offerMutations,
  ...invoiceMutations,
  ...unitTypesMutations,
  ...opptyMutations,
  ...statusMutations,
};

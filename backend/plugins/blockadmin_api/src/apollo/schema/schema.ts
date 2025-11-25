import {
  queries as ProjectQueries,
  types as ProjectTypes,
} from '@/project/graphql/schemas/project';

import {
  queries as PaymentQueries,
  types as PaymentTypes,
} from '@/project/graphql/schemas/payment';

import {
  queries as BuildingQueries,
  types as BuildingTypes,
} from '@/building/graphql/schemas/building';

import {
  queries as DocumentQueries,
  types as DocumentTypes,
} from '@/document/graphql/schemas/document';

import {
  queries as UnitQueries,
  types as UnitTypes,
} from '@/unit/graphql/schemas/unit';

import {
  queries as ZoningQueries,
  types as ZoningTypes,
} from '@/building/graphql/schemas/zoning';

import {
  queries as AttachmentQueries,
  types as AttachmentTypes,
} from '@/attachment/graphql/schemas/attachment';

import {
  mutations as DeveloperMutations,
  queries as DeveloperQueries,
  types as DeveloperTypes,
} from '@/developer/graphql/schemas/developer';

import {
  queries as ProjectMemberQueries,
  types as ProjectMemberTypes,
} from '@/project/graphql/schemas/member';

import {
  queries as UnitLeadQueries,
  types as UnitLeadTypes,
} from '@/unit/graphql/schemas/unitLead';

import {
  queries as InvoiceQueries,
  types as InvoiceTypes,
} from '@/invoice/graphql/schemas/invoice';

import {
  queries as ContractQueries,
  types as ContractTypes,
} from '@/contract/graphql/schemas/contract';

import {
  queries as OfferQueries,
  types as OfferTypes,
} from '@/contract/graphql/schemas/offer';

import {
  queries as FormQueries,
  mutations as SubmissionMutations,
  types as SubmissionTypes,
} from '@/form/graphql/schemas';

import {
  queries as ClientPortalBlockQueries,
  types as ClientPortalBlockTypes,
} from '~/modules/clientportal/graphql/schemas';

import { TypeExtensions } from './extensions';

export const types = `
  ${TypeExtensions}
  ${ProjectTypes}
  ${PaymentTypes}
  ${BuildingTypes}
  ${DocumentTypes}
  ${UnitTypes}
  ${ZoningTypes}
  ${AttachmentTypes}
  ${DeveloperTypes}
  ${ProjectMemberTypes}
  ${UnitLeadTypes}
  ${InvoiceTypes}
  ${ContractTypes}
  ${OfferTypes}
  ${SubmissionTypes}

  ${ClientPortalBlockTypes}
  `;

export const queries = `
  ${ProjectQueries}
  ${PaymentQueries}
  ${BuildingQueries}
  ${DocumentQueries}
  ${UnitQueries}
  ${ZoningQueries}
  ${AttachmentQueries}
  ${DeveloperQueries}
  ${ProjectMemberQueries}
  ${UnitLeadQueries}
  ${InvoiceQueries}
  ${ContractQueries}
  ${OfferQueries}
  ${FormQueries}

  ${ClientPortalBlockQueries}
  `;

export const mutations = `
  ${SubmissionMutations}
  ${DeveloperMutations}
  `;

export default { types, queries, mutations };

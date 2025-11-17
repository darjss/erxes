import {
  mutations as ProjectMutations,
  queries as ProjectQueries,
  types as ProjectTypes,
} from '@/project/graphql/schemas/project';

import {
  mutations as PaymentMutations,
  queries as PaymentQueries,
  types as PaymentTypes,
} from '@/project/graphql/schemas/payment';

import {
  mutations as DocumentMutations,
  queries as DocumentQueries,
  types as DocumentTypes,
} from '@/document/graphql/schemas/document';

import {
  mutations as AttachmentMutations,
  queries as AttachmentQueries,
  types as AttachmentTypes,
} from '@/attachment/graphql/schemas/attachment';

import {
  mutations as CompanyMutations,
  queries as CompanyQueries,
  types as CompanyTypes,
} from '@/company/graphql/schemas/company';

import {
  mutations as ProjectMemberMutations,
  queries as ProjectMemberQueries,
  types as ProjectMemberTypes,
} from '@/project/graphql/schemas/member';

export const types = `
  ${ProjectTypes}
  ${PaymentTypes}
  ${DocumentTypes}
  ${AttachmentTypes}
  ${CompanyTypes}
  ${ProjectMemberTypes}

  `;

export const queries = `
  ${ProjectQueries}
  ${PaymentQueries}
  ${DocumentQueries}
  ${AttachmentQueries}
  ${CompanyQueries}
  ${ProjectMemberQueries}

  `;

export const mutations = `
  ${ProjectMutations}
  ${PaymentMutations}
  ${DocumentMutations}
  ${AttachmentMutations}
  ${CompanyMutations}
  ${ProjectMemberMutations}

  `;

export default { types, queries, mutations };

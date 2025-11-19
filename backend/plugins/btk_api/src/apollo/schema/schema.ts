import {
  mutations as NewsMutations,
  queries as NewsQueries,
  types as NewsTypes,
} from '~/modules/news/graphql/schemas/news';

import {
  mutations as PaymentMutations,
  queries as PaymentQueries,
  types as PaymentTypes,
} from '~/modules/news/graphql/schemas/payment';

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
  mutations as NewsMemberMutations,
  queries as NewsMemberQueries,
  types as NewsMemberTypes,
} from '~/modules/news/graphql/schemas/member';

export const types = `
  ${NewsTypes}
  ${PaymentTypes}
  ${DocumentTypes}
  ${AttachmentTypes}
  ${CompanyTypes}
  ${NewsMemberTypes}

  `;

export const queries = `
  ${NewsQueries}
  ${PaymentQueries}
  ${DocumentQueries}
  ${AttachmentQueries}
  ${CompanyQueries}
  ${NewsMemberQueries}

  `;

export const mutations = `
  ${NewsMutations}
  ${PaymentMutations}
  ${DocumentMutations}
  ${AttachmentMutations}
  ${CompanyMutations}
  ${NewsMemberMutations}

  `;

export default { types, queries, mutations };

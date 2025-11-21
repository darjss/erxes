import {
  queries as NewsQueries,
  types as NewsTypes,
} from '~/modules/news/graphql/schemas/news';

import {
  queries as PaymentQueries,
  types as PaymentTypes,
} from '~/modules/news/graphql/schemas/payment';

import {
  queries as DocumentQueries,
  types as DocumentTypes,
} from '@/document/graphql/schemas/document';

import {
  queries as AttachmentQueries,
  types as AttachmentTypes,
} from '@/attachment/graphql/schemas/attachment';

import {
  queries as CompanyQueries,
  types as CompanyTypes,
} from '~/modules/company/graphql/schemas/company';

import {
  queries as NewsMemberQueries,
  types as NewsMemberTypes,
} from '~/modules/news/graphql/schemas/member';

import {
  mutations as SubmissionMutations,
  queries as SubmissionQueries,
  types as SubmissionTypes,
} from '@/form/graphql/schemas';

import {
  queries as ClientPortalBtkQueries,
  types as ClientPortalBtkTypes,
} from '~/modules/clientportal/graphql/schemas';

import { TypeExtensions } from './extensions';

export const types = `
  ${TypeExtensions}
  ${NewsTypes}
  ${PaymentTypes}
  ${DocumentTypes}
  ${AttachmentTypes}
  ${CompanyTypes}
  ${NewsMemberTypes}
  ${SubmissionTypes}

  ${ClientPortalBtkTypes}
  `;

export const queries = `
  ${NewsQueries}
  ${PaymentQueries}
  ${DocumentQueries}
  ${AttachmentQueries}
  ${CompanyQueries}
  ${NewsMemberQueries}
  ${SubmissionQueries}

  ${ClientPortalBtkQueries}
  `;

export const mutations = `
  ${SubmissionMutations}
  `;

export default { types, queries, mutations };

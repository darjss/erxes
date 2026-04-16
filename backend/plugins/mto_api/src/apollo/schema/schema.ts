import {
  types as ProviderTypes,
  queries as ProviderQueries,
  mutations as ProviderMutations,
} from '@/provider/graphql/schemas/provider';

import {
  types as ConfigTypes,
  queries as ConfigQueries,
  mutations as ConfigMutations,
} from '@/config/graphql/schemas/config';

import {
  types as BannerTypes,
  queries as BannerQueries,
  mutations as BannerMutations,
} from '@/banner/graphql/schemas/banner';

import {
  types as RegistrationTypes,
  queries as RegistrationQueries,
  mutations as RegistrationMutations,
} from '@/registration/graphql/schemas/registration';
import { TypeExtensions } from './extensions';

export const types = `
  ${TypeExtensions}
  ${ProviderTypes}
  ${ConfigTypes}
  ${BannerTypes}
  ${RegistrationTypes}
`;

export const queries = `
  ${ProviderQueries}
  ${ConfigQueries}
  ${BannerQueries}
  ${RegistrationQueries}
`;

export const mutations = `
  ${ProviderMutations}
  ${ConfigMutations}
  ${BannerMutations}
  ${RegistrationMutations}
`;

export default { types, queries, mutations };

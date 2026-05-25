import {
  types as ProviderTypes,
  queries as ProviderQueries,
  mutations as ProviderMutations,
} from '@/provider/graphql/schemas/provider';

import {
  types as AssociationTypes,
  queries as AssociationQueries,
  mutations as AssociationMutations,
} from '@/association/graphql/schemas/association';

import {
  types as ConfigTypes,
  queries as ConfigQueries,
  mutations as ConfigMutations,
} from '@/config/graphql/schemas/config';


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
  ${AssociationTypes}
  ${RegistrationTypes}
`;

export const queries = `
  ${ProviderQueries}
  ${ConfigQueries}
  ${AssociationQueries}
  ${RegistrationQueries}
`;

export const mutations = `
  ${ProviderMutations}
  ${ConfigMutations}
  ${AssociationMutations}
  ${RegistrationMutations}
`;

export default { types, queries, mutations };

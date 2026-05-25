import { providerMutations } from '@/provider/graphql/resolvers/mutations/provider';
import { associationMutations } from '@/association/graphql/resolvers/mutations/association';

import { configMutations } from '@/config/graphql/resolvers/mutations/config';


import { registrationMutations } from '@/registration/graphql/resolvers/mutations/registration';
import { registrationFormSchemaMutations } from '@/registration/graphql/resolvers/mutations/registrationFormSchemas';

export const mutations = Object.assign(
  {},
  providerMutations,
  configMutations,
  associationMutations,
  registrationMutations,
  registrationFormSchemaMutations,
);

import { providerMutations } from '@/provider/graphql/resolvers/mutations/provider';

import { configMutations } from '@/config/graphql/resolvers/mutations/config';

import { bannerMutations } from '@/banner/graphql/resolvers/mutations/banner';

import { registrationMutations } from '@/registration/graphql/resolvers/mutations/registration';
import { registrationFormSchemaMutations } from '@/registration/graphql/resolvers/mutations/registrationFormSchemas';

export const mutations = Object.assign(
  {},
  providerMutations,
  configMutations,
  bannerMutations,
  registrationMutations,
  registrationFormSchemaMutations,
);

import { apolloCustomScalars } from 'erxes-api-shared/utils';
import { MushopSupplier } from '@/supplier/graphql/resolvers/customResolvers/supplier';
import { MushopProduct } from '@/product/graphql/resolvers/customResolvers/mushopProduct';
import { mutations } from './mutations';
import { queries } from './queries';
import { subscriptionTypeResolvers } from '@/subscription/graphql/resolvers/queries/mushopSubscription';

const resolvers: any = {
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
  MushopSupplier,
  MushopProduct,
  ...subscriptionTypeResolvers,
  ...apolloCustomScalars,
};

export default resolvers;

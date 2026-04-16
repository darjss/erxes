import { apolloCustomScalars } from 'erxes-api-shared/utils';
import { MushopSupplier } from '@/supplier/graphql/resolvers/customResolvers/supplier';
import { MushopProduct } from '@/product/graphql/resolvers/customResolvers/mushopProduct';
import { mutations } from './mutations';
import { queries } from './queries';

const resolvers: any = {
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
  MushopSupplier,
  MushopProduct,
  ...apolloCustomScalars,
};

export default resolvers;

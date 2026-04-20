import { apolloCustomScalars } from 'erxes-api-shared/utils';
import { customResolvers } from './resolvers';
import { WrappedMutation, DirectMutation } from './mutations';
import { queries } from './queries';

const resolvers: any = {
  WrappedMutation,
  DirectMutation,
  Query: {
    ...queries,
  },
  ...apolloCustomScalars,
  ...customResolvers,
};

export default resolvers;

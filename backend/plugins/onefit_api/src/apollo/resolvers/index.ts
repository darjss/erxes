import { apolloCustomScalars } from 'erxes-api-shared/utils';
import { mutations } from './mutations';
import { queries } from './queries';
import { customResolvers } from './resolvers';

const resolvers: any = {
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
  ...apolloCustomScalars,
  ...customResolvers,
};

export default resolvers;

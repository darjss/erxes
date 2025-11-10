import { apolloCustomScalars } from 'erxes-api-shared/utils';
import { queries } from './queries';
import { customResolvers } from './resolvers';

const resolvers: any = {
  Query: {
    ...queries,
  },
  ...apolloCustomScalars,
  ...customResolvers,
};

export default resolvers;

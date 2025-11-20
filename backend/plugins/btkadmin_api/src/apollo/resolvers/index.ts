import { apolloCustomScalars } from 'erxes-api-shared/utils';
import { mutations } from './mutations';
import { queries } from './queries';

const resolvers: any = {
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
  ...apolloCustomScalars,
};

export default resolvers;

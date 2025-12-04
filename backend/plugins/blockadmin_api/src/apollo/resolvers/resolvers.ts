import cpCustomResolvers from '@/clientportal/graphql/resolvers/customResolvers';
import developerCustomResolvers from '@/developer/graphql/resolvers/customResolvers';
import formCustomResolvers from '@/form/graphql/customResolver';
import projectCustomResolvers from '@/project/graphql/resolvers/customResolvers';
import unitCustomResolvers from '@/unit/graphql/resolvers/customResolvers';

export const customResolvers = {
  ...unitCustomResolvers,
  ...projectCustomResolvers,
  ...formCustomResolvers,
  ...developerCustomResolvers,

  ...cpCustomResolvers,
};

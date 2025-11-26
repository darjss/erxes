import formCustomResolvers from '@/form/graphql/customResolver';
import projectCustomResolvers from '@/project/graphql/resolvers/customResolvers';
import unitCustomResolvers from '@/unit/graphql/resolvers/customResolvers';
import cpCustomResolvers from '@/clientportal/graphql/resolvers/customResolvers';

export const customResolvers = {
  ...unitCustomResolvers,
  ...projectCustomResolvers,
  ...formCustomResolvers,

  ...cpCustomResolvers,
};

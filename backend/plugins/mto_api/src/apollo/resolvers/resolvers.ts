import providerCustomResolvers from '@/provider/graphql/resolvers/customResolvers/provider';
import associationCustomResolvers from '@/association/graphql/resolvers/customResolvers/association';
import eventCustomResolvers from '@/event/graphql/resolvers/customResolvers/event';

export const customResolvers = {
  ...providerCustomResolvers,
  ...associationCustomResolvers,
  ...eventCustomResolvers,
};

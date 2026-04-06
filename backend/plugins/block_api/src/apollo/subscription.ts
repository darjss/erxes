import { withFilter } from 'graphql-subscriptions';

export default {
  name: 'block',
  typeDefs: `
      blockOpptyChanged(_id: String!): OpptySubscription
      blockOpptyListChanged(projectId: String, filter: IOpptyFilter): OpptySubscription
		`,
  generateResolvers: (graphqlPubsub) => {
    return {
      blockOpptyChanged: {
        resolve: (payload) => payload.blockOpptyChanged,
        subscribe: (_, { _id }) =>
          graphqlPubsub.asyncIterator(`blockOpptyChanged:${_id}`),
      },

      blockOpptyListChanged: {
        resolve: (payload) => payload.blockOpptyListChanged,
        subscribe: withFilter(
          () => graphqlPubsub.asyncIterator('blockOpptyListChanged'),
          async (payload, variables) => {
            const oppty = payload.blockOpptyListChanged.oppty;
            const projectId = variables.projectId || '';
            const filter = variables.filter || {};

            if (projectId && oppty.projectId !== projectId) return false;

            if (filter.status && oppty.status !== filter.status) return false;
            if (
              filter.assignedUserId &&
              oppty.assignedUserId !== filter.assignedUserId
            )
              return false;
            if (filter.labelId && !oppty.labelIds.includes(filter.labelId))
              return false;
            if (filter.tagId && !oppty.tagIds.includes(filter.tagId))
              return false;

            if (filter.customerId && oppty.customerId !== filter.customerId)
              return false;
            if (filter.unitType && !oppty.unitTypes.includes(filter.unitType))
              return false;
            if (filter.unit && !oppty.units.includes(filter.unit)) return false;
            if (
              filter.startDate &&
              new Date(oppty.startDate) < new Date(filter.startDate)
            )
              return false;
            if (
              filter.targetDate &&
              new Date(oppty.targetDate) < new Date(filter.targetDate)
            )
              return false;
            if (
              filter.customerSource &&
              oppty.customerSource !== filter.customerSource
            )
              return false;

            if (
              filter.createdAt &&
              new Date(oppty.createdAt) < new Date(filter.createdAt)
            )
              return false;
            if (
              filter.updatedAt &&
              new Date(oppty.updatedAt) < new Date(filter.updatedAt)
            )
              return false;

            return true;
          },
        ),
      },
    };
  },
};

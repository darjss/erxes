export default {
  name: 'blockagency',
  typeDefs: `
    blockAgencyVerificationStatusChanged: BlockAgencyVerificationStatus
  `,
  generateResolvers: (graphqlPubsub) => {
    return {
      blockAgencyVerificationStatusChanged: {
        resolve: (payload) => payload.blockAgencyVerificationStatusChanged,
        subscribe: () =>
          graphqlPubsub.asyncIterator('blockAgencyVerificationStatusChanged'),
      },
    };
  },
};

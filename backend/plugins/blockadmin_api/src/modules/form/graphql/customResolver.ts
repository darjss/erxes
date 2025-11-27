import { ISubmission } from '../@types';

export default {
  BlockSubmission: {
    lead: async ({ userId }: ISubmission) => {
      return (
        userId && {
          __typename: 'Customer',
          _id: userId,
        }
      );
    },
  },
};

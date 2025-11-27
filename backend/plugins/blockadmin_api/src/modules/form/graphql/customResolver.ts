import { ISubmission } from '../@types';

export default {
  BlockSubmission: {
    cpUser: async ({ userId }: ISubmission) => {
      return (
        userId && {
          __typename: 'Customer',
          _id: userId,
        }
      );
    },
  },
};

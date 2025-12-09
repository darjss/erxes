import { gql } from '@apollo/client';

export const CREATE_CV_CLIENT = gql`
  mutation CreateCVClient($input: CVClientInput!) {
    createCVClient(input: $input) {
      _id
    }
  }
`;

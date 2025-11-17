import { gql } from '@apollo/client';

export const CREATE_OFFER = gql`
  mutation BtkCreateOffer($input: BtkOfferInput!) {
    btkCreateOffer(input: $input) {
      _id
    }
  }
`;

export const UPDATE_OFFER = gql`
  mutation BtkUpdateOffer($id: String!, $input: BtkOfferInput!) {
    btkUpdateOffer(_id: $id, input: $input) {
      _id
    }
  }
`;

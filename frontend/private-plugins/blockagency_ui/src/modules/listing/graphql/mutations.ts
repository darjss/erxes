import { gql } from '@apollo/client';

export const CREATE_LISTING = gql`
  mutation BlockCreateListing($input: BlockListingInput!) {
    blockCreateListing(input: $input) {
      _id
      title
      type
      propertyType
      status
    }
  }
`;

export const UPDATE_LISTING = gql`
  mutation BlockUpdateListingGeneralInfo($_id: String!, $input: BlockListingInput!) {
    blockUpdateListingGeneralInfo(_id: $_id, input: $input) {
      _id
      title
      type
      propertyType
      status
    }
  }
`;

export const REMOVE_LISTING = gql`
  mutation BlockRemoveListing($_id: String!) {
    blockRemoveListing(_id: $_id) {
      _id
    }
  }
`;

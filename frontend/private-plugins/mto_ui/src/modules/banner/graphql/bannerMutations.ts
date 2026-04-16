import { gql } from '@apollo/client';

export const ONE_FIT_BANNER_CREATE = gql`
  mutation MtoBannerCreate(
    $image: String!
    $providerId: String!
    $type: String!
    $status: String
  ) {
    mtoBannerCreate(
      image: $image
      providerId: $providerId
      type: $type
      status: $status
    ) {
      _id
      createdAt
      modifiedAt
      image
      providerId
      type
      status
    }
  }
`;

export const ONE_FIT_BANNER_UPDATE = gql`
  mutation MtoBannerUpdate(
    $_id: String!
    $image: String
    $providerId: String
    $type: String
    $status: String
  ) {
    mtoBannerUpdate(
      _id: $_id
      image: $image
      providerId: $providerId
      type: $type
      status: $status
    ) {
      _id
      modifiedAt
      image
      providerId
      type
      status
    }
  }
`;

export const ONE_FIT_BANNERS_REMOVE = gql`
  mutation MtoBannersRemove($ids: [String]!) {
    mtoBannersRemove(ids: $ids)
  }
`;

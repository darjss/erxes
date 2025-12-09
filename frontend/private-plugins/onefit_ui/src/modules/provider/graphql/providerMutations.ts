import { gql } from '@apollo/client';

export const ONE_FIT_PROVIDER_CREATE = gql`
  mutation OneFitProviderCreate(
    $businessName: String!
    $description: String
    $location: OneFitLocationInput!
    $contactInfo: OneFitContactInfoInput!
    $facilities: [String]
    $categoryIds: [String]!
    $isActive: Boolean
  ) {
    oneFitProviderCreate(
      businessName: $businessName
      description: $description
      location: $location
      contactInfo: $contactInfo
      facilities: $facilities
      categoryIds: $categoryIds
      isActive: $isActive
    ) {
      _id
      createdAt
      modifiedAt
      businessName
      description
      location {
        address
        city
        district
        coordinates {
          lat
          lng
        }
      }
      contactInfo {
        phone
        email
        website
      }
      facilities
      categoryIds
      status
      isActive
    }
  }
`;

export const ONE_FIT_PROVIDER_UPDATE = gql`
  mutation OneFitProviderUpdate(
    $_id: String!
    $businessName: String!
    $description: String
    $location: OneFitLocationInput!
    $contactInfo: OneFitContactInfoInput!
    $facilities: [String]
    $categoryIds: [String]!
    $isActive: Boolean
  ) {
    oneFitProviderUpdate(
      _id: $_id
      businessName: $businessName
      description: $description
      location: $location
      contactInfo: $contactInfo
      facilities: $facilities
      categoryIds: $categoryIds
      isActive: $isActive
    ) {
      _id
      modifiedAt
      businessName
      description
      location {
        address
        city
        district
        coordinates {
          lat
          lng
        }
      }
      contactInfo {
        phone
        email
        website
      }
      facilities
      categoryIds
      status
      isActive
    }
  }
`;

export const ONE_FIT_PROVIDER_APPROVE = gql`
  mutation OneFitProviderApprove($_id: String!, $approvedBy: String!) {
    oneFitProviderApprove(_id: $_id, approvedBy: $approvedBy) {
      _id
      status
      approvedAt
      approvedBy
    }
  }
`;

export const ONE_FIT_PROVIDER_REJECT = gql`
  mutation OneFitProviderReject(
    $_id: String!
    $rejectionReason: String!
    $rejectedBy: String!
  ) {
    oneFitProviderReject(
      _id: $_id
      rejectionReason: $rejectionReason
      rejectedBy: $rejectedBy
    ) {
      _id
      status
      rejectionReason
      rejectedBy
    }
  }
`;

export const ONE_FIT_PROVIDERS_REMOVE = gql`
  mutation OneFitProvidersRemove($ids: [String]!) {
    oneFitProvidersRemove(ids: $ids)
  }
`;

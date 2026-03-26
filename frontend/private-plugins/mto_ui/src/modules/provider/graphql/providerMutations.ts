import { gql } from '@apollo/client';

export const ONE_FIT_PROVIDER_CREATE = gql`
  mutation MtoProviderCreate(
    $businessName: MtoMultilingualStringInput!
    $description: MtoMultilingualStringOptionalInput
    $contactInfo: MtoContactInfoInput!
    $facilities: [String]
    $categoryIds: [String]!
    $singleProviderLimit: Int
    $isActive: Boolean
    $icon: String
    $coverImages: [String]
  ) {
    mtoProviderCreate(
      businessName: $businessName
      description: $description
      contactInfo: $contactInfo
      facilities: $facilities
      categoryIds: $categoryIds
      singleProviderLimit: $singleProviderLimit
      isActive: $isActive
      icon: $icon
      coverImages: $coverImages
    ) {
      _id
      createdAt
      modifiedAt
      businessName {
        en
        mn
      }
      description {
        en
        mn
      }
      contactInfo {
        phone
        email
        website
      }
      facilities
      categoryIds
      singleProviderLimit
      status
      isActive
      icon
      coverImages
    }
  }
`;

export const ONE_FIT_PROVIDER_UPDATE = gql`
  mutation MtoProviderUpdate(
    $_id: String!
    $businessName: MtoMultilingualStringInput
    $description: MtoMultilingualStringOptionalInput
    $contactInfo: MtoContactInfoInput!
    $facilities: [String]
    $categoryIds: [String]!
    $singleProviderLimit: Int
    $isActive: Boolean
    $icon: String
    $coverImages: [String]
  ) {
    mtoProviderUpdate(
      _id: $_id
      businessName: $businessName
      description: $description
      contactInfo: $contactInfo
      facilities: $facilities
      categoryIds: $categoryIds
      singleProviderLimit: $singleProviderLimit
      isActive: $isActive
      icon: $icon
      coverImages: $coverImages
    ) {
      _id
      modifiedAt
      businessName {
        en
        mn
      }
      description {
        en
        mn
      }
      contactInfo {
        phone
        email
        website
      }
      facilities
      categoryIds
      singleProviderLimit
      status
      isActive
      icon
      coverImages
    }
  }
`;

export const ONE_FIT_PROVIDER_APPROVE = gql`
  mutation MtoProviderApprove($_id: String!, $approvedBy: String!) {
    mtoProviderApprove(_id: $_id, approvedBy: $approvedBy) {
      _id
      status
      approvedAt
      approvedBy
    }
  }
`;

export const ONE_FIT_PROVIDER_REJECT = gql`
  mutation MtoProviderReject(
    $_id: String!
    $rejectionReason: String!
    $rejectedBy: String!
  ) {
    mtoProviderReject(
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
  mutation MtoProvidersRemove($ids: [String]!) {
    mtoProvidersRemove(ids: $ids)
  }
`;

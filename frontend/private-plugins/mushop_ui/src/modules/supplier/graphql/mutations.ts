import { gql } from '@apollo/client';

export const MUSHOP_UPDATE_SUPPLIER_VERIFICATION_STATUS = gql`
  mutation MushopUpdateSupplierVerificationStatus(
    $_id: String!
    $verificationStatus: String!
  ) {
    mushopUpdateSupplierVerificationStatus(
      _id: $_id
      verificationStatus: $verificationStatus
    ) {
      _id
      verificationStatus
    }
  }
`;

export const MUSHOP_UPDATE_SUPPLIER_TIER = gql`
  mutation MushopUpdateSupplierTier($_id: String!, $tierLevel: String!) {
    mushopUpdateSupplierTier(_id: $_id, tierLevel: $tierLevel) {
      _id
      tierLevel
    }
  }
`;

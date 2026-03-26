import { gql } from '@apollo/client';

export const MTO_REGISTRATION_MEMBERSHIP_SUMMARIES = gql`
  query MtoRegistrationMembershipSummaries {
    mtoRegistrationMembershipSummaries {
      membershipTypeId
      title
      schemaVersion
    }
  }
`;

export const MTO_REGISTRATION_FORM_DEFINITION = gql`
  query MtoRegistrationFormDefinition(
    $membershipTypeId: String!
    $version: String
  ) {
    mtoRegistrationFormDefinition(
      membershipTypeId: $membershipTypeId
      version: $version
    )
  }
`;

import { gql } from '@apollo/client';

export const MTO_REGISTRATION_SUBMIT = gql`
  mutation MtoRegistrationSubmit(
    $membershipTypeId: String!
    $schemaVersion: String!
    $answers: JSON!
  ) {
    mtoRegistrationSubmit(
      membershipTypeId: $membershipTypeId
      schemaVersion: $schemaVersion
      answers: $answers
    ) {
      _id
      status
      membershipTypeId
      schemaVersion
      createdAt
    }
  }
`;

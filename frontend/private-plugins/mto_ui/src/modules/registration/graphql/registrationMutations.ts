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

export const MTO_REGISTRATION_APPLICATION_UPDATE = gql`
  mutation MtoRegistrationApplicationUpdate(
    $_id: String!
    $answers: JSON
    $status: String
  ) {
    mtoRegistrationApplicationUpdate(_id: $_id, answers: $answers, status: $status) {
      _id
      status
      membershipTypeId
      membershipTypeTitle
      schemaVersion
      answers
      modifiedAt
    }
  }
`;

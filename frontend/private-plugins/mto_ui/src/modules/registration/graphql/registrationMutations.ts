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

export const MTO_REGISTRATION_FORM_SCHEMA_CREATE = gql`
  mutation MtoRegistrationFormSchemaCreate($definition: JSON!) {
    mtoRegistrationFormSchemaCreate(definition: $definition) {
      _id
      membershipTypeId
      schemaVersion
      title
      description
      sections
      applicationsCount
    }
  }
`;

export const MTO_REGISTRATION_FORM_SCHEMA_UPDATE = gql`
  mutation MtoRegistrationFormSchemaUpdate($_id: String!, $definition: JSON!) {
    mtoRegistrationFormSchemaUpdate(_id: $_id, definition: $definition) {
      _id
      membershipTypeId
      schemaVersion
      title
      description
      sections
      applicationsCount
    }
  }
`;

export const MTO_REGISTRATION_FORM_SCHEMA_REMOVE = gql`
  mutation MtoRegistrationFormSchemaRemove($_id: String!) {
    mtoRegistrationFormSchemaRemove(_id: $_id)
  }
`;

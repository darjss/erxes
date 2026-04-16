import { gql } from '@apollo/client';

export const MTO_REGISTRATION_SUBMIT = gql`
  mutation MtoRegistrationSubmit(
    $membershipTypeId: String!
    $schemaVersion: String!
    $answers: JSON!
    $cpUserId: String
    $clientPortalId: String
    $cpUserPhone: String
  ) {
    mtoRegistrationSubmit(
      membershipTypeId: $membershipTypeId
      schemaVersion: $schemaVersion
      answers: $answers
      cpUserId: $cpUserId
      clientPortalId: $clientPortalId
      cpUserPhone: $cpUserPhone
    ) {
      _id
      status
      membershipTypeId
      schemaVersion
      createdAt
      cpUserId
      clientPortalId
      cpUserPhone
    }
  }
`;

export const MTO_REGISTRATION_APPLICATION_UPDATE = gql`
  mutation MtoRegistrationApplicationUpdate(
    $_id: String!
    $answers: JSON
    $status: String
    $cpUserId: String
    $clientPortalId: String
    $cpUserPhone: String
  ) {
    mtoRegistrationApplicationUpdate(
      _id: $_id
      answers: $answers
      status: $status
      cpUserId: $cpUserId
      clientPortalId: $clientPortalId
      cpUserPhone: $cpUserPhone
    ) {
      _id
      status
      membershipTypeId
      membershipTypeTitle
      schemaVersion
      answers
      modifiedAt
      cpUserId
      clientPortalId
      cpUserPhone
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

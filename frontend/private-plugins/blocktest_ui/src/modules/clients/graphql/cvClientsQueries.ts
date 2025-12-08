import { gql } from '@apollo/client';
import { GQL_PAGE_INFO } from 'erxes-ui';

export const GET_CV_CLIENT_DETAIL = gql`
  query GetCVClient($id: String!) {
    getCVClient(_id: $id) {
      _id
      name
      client_type
      lead_source
      registration_number
      operational_address
      business_type
      business_category
      status
      cvh_broker
      existing_insurance_policies
      claim_history_file
      description
      registered_date
      isActive
      bor_file
      service_agreement_file
      insurance_types
      contacts {
        name
        position
        phone_number
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CV_CLIENTS = gql`
  query GetCVClients($filter: CVClientFilterInput) {
  getCVClients(filter: $filter) {
    list {
      _id
      name
      client_type
      lead_source
      registration_number
      operational_address
      business_type
      business_category
      status
      cvh_broker
      existing_insurance_policies
      claim_history_file
      description
      registered_date
      isActive
      bor_file
      service_agreement_file
      insurance_types
      contacts {
        name
        position
        phone_number
        email
      }
      createdAt
      updatedAt
    }
    ${GQL_PAGE_INFO}
  }
}
`;

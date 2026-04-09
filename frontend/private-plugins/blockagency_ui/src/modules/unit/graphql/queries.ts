import { gql } from '@apollo/client';

export const GET_AGENCY_UNITS = gql`
  query BlockAgencyGetUnits($agencyId: String, $page: Int, $perPage: Int) {
    blockAgencyGetUnits(agencyId: $agencyId, page: $page, perPage: $perPage) {
      _id
      blockUnitId
      unitNumber
      agencyId
      blockSubdomain
      agencySubdomain
      blockDeveloperName
      agency {
        name
      }
      memberId
      assignedAt
      createdAt
    }
  }
`;

export const GET_AGENCY_UNITS_TOTAL_COUNT = gql`
  query BlockAgencyGetUnitsTotalCount($agencyId: String) {
    blockAgencyGetUnitsTotalCount(agencyId: $agencyId)
  }
`;

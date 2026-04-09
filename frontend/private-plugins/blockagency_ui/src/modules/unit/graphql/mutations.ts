import { gql } from '@apollo/client';

export const ASSIGN_UNIT_TO_MEMBER = gql`
  mutation BlockAgencyAssignUnitToMember($_id: String!, $memberId: String) {
    blockAgencyAssignUnitToMember(_id: $_id, memberId: $memberId) {
      _id
      memberId
    }
  }
`;

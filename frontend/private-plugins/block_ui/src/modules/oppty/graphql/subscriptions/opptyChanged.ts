import { gql } from '@apollo/client';

export const OPPTY_CHANGED = gql`
  subscription opptyChanged($_id: String!) {
    opptyChanged(_id: $_id) {
      type
      oppty {
        _id
        number
        description
        customerId
        unitTypes
        units
        assignedUserId
        status
        labelIds
        tagIds
        projectId
        startDate
        targetDate
        customerSource
        createdAt
        updatedAt
      }
    }
  }
`;

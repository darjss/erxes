import { gql } from '@apollo/client';

export const UPDATE_OPPTY_MUTATION = gql`
  mutation UpdateOppty($_id: String!, $input: IOpptyInput!) {
    updateOppty(_id: $_id, input: $input) {
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
`;

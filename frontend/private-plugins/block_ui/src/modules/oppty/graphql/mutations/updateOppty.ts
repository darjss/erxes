import { gql } from '@apollo/client';

export const UPDATE_OPPTY_MUTATION = gql`
  mutation BlockUpdateOppty($_id: String!, $input: IOpptyInput!) {
    blockUpdateOppty(_id: $_id, input: $input) {
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

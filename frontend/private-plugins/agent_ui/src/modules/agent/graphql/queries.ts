import { gql } from '@apollo/client';

export const GET_AGENT = gql`
  query GetAgent {
    getAgent {
      _id
      name
      url
      token
      agentId
      serverId
      createdAt
      updatedAt
    }
  }
`;

import { gql } from '@apollo/client';

export const DEPLOY_AGENT = gql`
  mutation deployAgent($input: DeployAgentInput!) {
    deployAgent(input: $input) {
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

export const APPROVE_AGENT = gql`
  mutation ApproveAgent($input: ApproveAgentInput!) {
    approveAgent(input: $input) {
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


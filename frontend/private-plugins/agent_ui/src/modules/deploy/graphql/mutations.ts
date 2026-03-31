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

export const UPDATE_AGENT_FILE = gql`
  mutation UpdateAgentFile($input: UpdateAgentFileInput!) {
    updateAgentFile(input: $input)
  }
`;

export const DESTROY_AGENT = gql`
  mutation DestroyAgent {
    destroyAgent {
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


import { gql } from '@apollo/client';

export const DEPLOY_AGENT = gql`
  mutation deployAgent($identifierId: String!, $input: DeployAgentInput!) {
    deployAgent(identifierId: $identifierId, input: $input) {
      _id
      identifierId
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
  mutation ApproveAgent($identifierId: String!, $input: ApproveAgentInput!) {
    approveAgent(identifierId: $identifierId, input: $input) {
      _id
      identifierId
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
  mutation DestroyAgent($identifierId: String!) {
    destroyAgent(identifierId: $identifierId) {
      _id
      identifierId
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

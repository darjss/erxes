import { gql } from '@apollo/client';

export const GET_AGENTS_LIST = gql`
  query GetAgentsList {
    getAgentsList {
      id
    }
  }
`;

export const GET_AGENT_DETAILS = gql`
  query GetAgentDetails($agentId: String) {
    getAgentDetails(agentId: $agentId) {
      fileName
      content
    }
  }
`;

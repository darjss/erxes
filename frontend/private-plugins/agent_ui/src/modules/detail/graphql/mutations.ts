import { gql } from '@apollo/client';

export const UPDATE_AGENT_FILE = gql`
  mutation UpdateAgentFile($input: UpdateAgentFileInput!) {
    updateAgentFile(input: $input)
  }
`;

export const ADD_AGENT = gql`
  mutation AddAgent($input: AddAgentInput!) {
    addAgent(input: $input)
  }
`;

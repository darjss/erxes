import { gql } from '@apollo/client';

export const UPDATE_AGENT_FILE = gql`
  mutation UpdateAgentFile($input: UpdateAgentFileInput!) {
    updateAgentFile(input: $input)
  }
`;

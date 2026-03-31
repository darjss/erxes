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

export const FIX_AND_RESTART_AGENT = gql`
  mutation FixAndRestartAgent {
    fixAndRestartAgent
  }
`;

export const UPDATE_DISCORD_SETTINGS = gql`
  mutation UpdateDiscordSettings($input: UpdateDiscordSettingsInput!) {
    updateDiscordSettings(input: $input)
  }
`;

export const ADD_DISCORD_GUILD = gql`
  mutation AddDiscordGuild($input: AddDiscordGuildInput!) {
    addDiscordGuild(input: $input)
  }
`;

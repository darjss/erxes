import { gql } from '@apollo/client';

export const UPDATE_AGENT_FILE = gql`
  mutation UpdateAgentFile($identifierId: String!, $input: UpdateAgentFileInput!) {
    updateAgentFile(identifierId: $identifierId, input: $input)
  }
`;

export const ADD_AGENT = gql`
  mutation AddAgent($identifierId: String!, $input: AddAgentInput!) {
    addAgent(identifierId: $identifierId, input: $input)
  }
`;

export const FIX_AND_RESTART_AGENT = gql`
  mutation FixAndRestartAgent($identifierId: String!) {
    fixAndRestartAgent(identifierId: $identifierId)
  }
`;

export const UPDATE_DISCORD_SETTINGS = gql`
  mutation UpdateDiscordSettings($identifierId: String!, $input: UpdateDiscordSettingsInput!) {
    updateDiscordSettings(identifierId: $identifierId, input: $input)
  }
`;

export const ADD_DISCORD_GUILD = gql`
  mutation AddDiscordGuild($identifierId: String!, $input: AddDiscordGuildInput!) {
    addDiscordGuild(identifierId: $identifierId, input: $input)
  }
`;

export const SET_KIMI_API_KEY = gql`
  mutation SetKimiApiKey($identifierId: String!, $input: SetKimiApiKeyInput!) {
    setKimiApiKey(identifierId: $identifierId, input: $input)
  }
`;

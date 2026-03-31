import { gql } from '@apollo/client';

export const GET_DISCORD_GUILDS = gql`
  query GetDiscordGuilds {
    getDiscordGuilds {
      guildId
      requireMention
    }
  }
`;

export const GET_AGENTS_LIST = gql`
  query GetAgentsList {
    getAgentsList {
      id
      identity
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

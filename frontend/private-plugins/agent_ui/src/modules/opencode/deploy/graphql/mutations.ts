import { gql } from '@apollo/client';

export const DEPLOY_OPENCODE = gql`
  mutation DeployOpencode($identifierId: String!, $input: DeployOpencodeInput!) {
    deployOpencode(identifierId: $identifierId, input: $input) {
      _id
      identifierId
      name
      url
      provider
      serverId
      createdAt
      updatedAt
      status
    }
  }
`;

export const DESTROY_OPENCODE = gql`
  mutation DestroyOpencode($identifierId: String!) {
    destroyOpencode(identifierId: $identifierId) {
      _id
      identifierId
      name
      url
      provider
      serverId
      createdAt
      updatedAt
      status
    }
  }
`;

import { gql } from '@apollo/client';

export const ONE_FIT_MODE = gql`
  query OneFitMode {
    oneFitMode
  }
`;

export const ONE_FIT_MASTER_URL = gql`
  query OneFitMasterUrl {
    oneFitMasterUrl
  }
`;

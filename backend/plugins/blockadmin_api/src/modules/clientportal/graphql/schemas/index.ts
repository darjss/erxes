import {
  queries as cpProjectQueries,
  types as cpProjectTypes,
} from './project';

import {
  queries as cpDeveloperQueries,
  types as cpDeveloperTypes,
} from './developer';

export const types = `
    ${cpProjectTypes}
    ${cpDeveloperTypes}
`;

export const queries = `
    ${cpProjectQueries}
    ${cpDeveloperQueries}
`;

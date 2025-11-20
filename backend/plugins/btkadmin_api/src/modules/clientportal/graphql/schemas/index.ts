import { queries as cpNewsQueries, types as cpNewsTypes } from './news';

import {
  queries as cpCompanyQueries,
  types as cpCompanyTypes,
} from './company';

export const types = `
    ${cpNewsTypes}
    ${cpCompanyTypes}
`;

export const queries = `
    ${cpNewsQueries}
    ${cpCompanyQueries}
`;

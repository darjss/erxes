import {
  queries as cpProjectQueries,
  types as cpProjectTypes,
} from './project';

import {
  queries as cpDeveloperQueries,
  types as cpDeveloperTypes,
} from './developer';

import {
  queries as cpBuildingQueries,
  types as cpBuildingTypes,
} from './building';

import { queries as cpUnitQueries, types as cpUnitTypes } from './unit';

export const types = `
    ${cpProjectTypes}
    ${cpDeveloperTypes}
    ${cpBuildingTypes}
    ${cpUnitTypes}
`;

export const queries = `
    ${cpProjectQueries}
    ${cpDeveloperQueries}
    ${cpBuildingQueries}
    ${cpUnitQueries}
`;

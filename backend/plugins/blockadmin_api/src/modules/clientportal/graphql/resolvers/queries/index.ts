import { cpBuildingQueries } from './building';
import { cpDeveloperQueries } from './developer';
import { cpProjectQueries } from './project';
import { cpUnitQueries } from './unit';

export const cpBlockQueries = {
  ...cpProjectQueries,
  ...cpDeveloperQueries,
  ...cpBuildingQueries,
  ...cpUnitQueries,
};

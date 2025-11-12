import { cpProjectQueries } from './project';
import { cpDeveloperQueries } from './developer';

export const cpBlockQueries = {
  ...cpProjectQueries,
  ...cpDeveloperQueries,
};

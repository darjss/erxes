import { cpNewsQueries } from './news';
import { cpCompanyQueries } from './company';

export const cpBtkQueries = {
  ...cpNewsQueries,
  ...cpCompanyQueries,
};

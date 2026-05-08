import { cpProductQueries } from './clientPortal';
import { productQueries } from './product';

export default {
  ...productQueries,
  ...cpProductQueries,
};

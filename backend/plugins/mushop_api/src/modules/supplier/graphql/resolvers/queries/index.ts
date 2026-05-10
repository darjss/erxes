import { cpSupplierQueries } from './clientPortal';
import { supplierQueries } from './supplier';

export default {
  ...supplierQueries,
  ...cpSupplierQueries,
};

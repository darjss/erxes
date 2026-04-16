import { IContext } from '~/connectionResolvers';

const normalizeSupplierAddress = (address: any) => {
  if (!address || typeof address !== 'object') return address;

  const details = address.details ?? address.address;
  const next = { ...address, details };

  if ('address' in next) {
    delete next.address;
  }

  return next;
};

export const Supplier = {
  address: (supplier: any) => normalizeSupplierAddress(supplier?.address),
  async __resolveReference(
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Supplier.findOne({ _id }).lean();
  },
};

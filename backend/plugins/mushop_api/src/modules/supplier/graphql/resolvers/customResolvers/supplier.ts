import { getEnv } from 'erxes-api-shared/utils';
import { IMushopSupplierDocument } from '~/modules/supplier/@types/supplier';

const DOMAIN = getEnv({ name: 'DOMAIN' });

export const MushopSupplier = {
  address: ({ address }: IMushopSupplierDocument) => {
    if (!address || typeof address !== 'object') return address;

    const details = address.details ?? address.address;
    const next = { ...address, details };

    if ('address' in next) {
      delete next.address;
    }

    return next;
  },
  logo: ({ logo, subdomain }: IMushopSupplierDocument) => {
    const domain = DOMAIN.replace('<subdomain>', subdomain);

    return domain && logo ? `${domain}/read-file?key=${logo}` : null;
  },
  coverImage: ({ coverImage, subdomain }: IMushopSupplierDocument) => {
    const domain = DOMAIN.replace('<subdomain>', subdomain);

    return domain && coverImage
      ? `${domain}/read-file?key=${coverImage}`
      : null;
  },
};

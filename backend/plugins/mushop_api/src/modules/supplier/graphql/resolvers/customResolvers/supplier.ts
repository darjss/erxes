import { getEnv } from 'erxes-api-shared/utils';
import { IMushopSupplierDocument } from '~/modules/supplier/@types/supplier';

const toFileUrl = (
  key: string | undefined,
  subdomain: string,
): string | null => {
  if (!key) return null;

  if (key.startsWith('http://') || key.startsWith('https://')) return key;

  const SUPPLIER_DOMAIN = getEnv({
    name: 'SUPPLIER_API_URL',
    subdomain,
    defaultValue: 'http://localhost:4000',
  });

  if (!SUPPLIER_DOMAIN) return null;

  const domain = SUPPLIER_DOMAIN.replace('<subdomain>', subdomain);

  return `${domain}/read-file?key=${key}`;
};

export const MushopSupplier = {
  address: ({ address }: IMushopSupplierDocument) => {
    if (!address || typeof address !== 'object') return address;

    const details = (address as any).details ?? (address as any).address;
    const next: any = { ...address, details };

    if ('address' in next) {
      delete next.address;
    }

    return next;
  },
  logo: ({ logo, subdomain }: IMushopSupplierDocument) =>
    toFileUrl(logo, subdomain),
  coverImage: ({ coverImage, subdomain }: IMushopSupplierDocument) =>
    toFileUrl(coverImage, subdomain),
};

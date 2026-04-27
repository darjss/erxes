import { getEnv } from 'erxes-api-shared/utils';
import { IMushopSupplierDocument } from '~/modules/supplier/@types/supplier';

const toFileUrl = (
  key: string | undefined,
  subdomain: string,
): string | null => {
  if (!key) return null;

  if (key.startsWith('http://') || key.startsWith('https://')) return key;

  const DOMAIN = getEnv({
    name: 'DOMAIN',
    subdomain,
    defaultValue: 'http://localhost:4000',
  });

  if (!DOMAIN) return null;

  const domain = DOMAIN.replace('<subdomain>', subdomain);

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

import { DropdownMenu } from 'erxes-ui';
import { ReactNode } from 'react';
import { useUpdateSupplierVerification } from '../hooks/useUpdateSupplierVerification';

const STATUSES = ['verified', 'unverified', 'pending'];

export const SupplierVerificationAction = ({
  supplierId,
  status,
  children,
}: {
  supplierId: string;
  status?: string;
  children: ReactNode;
}) => {
  const { updateVerification } = useUpdateSupplierVerification();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {STATUSES.map((s) => (
          <DropdownMenu.Item
            key={s}
            disabled={s === status}
            onClick={() => updateVerification(supplierId, s)}
          >
            Mark as {s}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

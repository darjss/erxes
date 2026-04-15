import { DropdownMenu } from 'erxes-ui';
import { ReactNode } from 'react';
import { useUpdateProductStatus } from '../hooks/useUpdateProductStatus';

const STATUSES = ['approved', 'rejected', 'pending'];

export const ProductStatusAction = ({
  productId,
  status,
  children,
}: {
  productId: string;
  status?: string;
  children: ReactNode;
}) => {
  const { updateStatus } = useUpdateProductStatus();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {STATUSES.map((s) => (
          <DropdownMenu.Item
            key={s}
            disabled={s === status}
            onClick={() =>
              updateStatus({ variables: { _id: productId, status: s } })
            }
          >
            Mark as {s}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

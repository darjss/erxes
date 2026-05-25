import { useCustomerInline } from 'ui-modules';

export const CustomerName = ({ customerId }: { customerId: string }) => {
  const { customer, loading } = useCustomerInline({
    variables: { _id: customerId },
    skip: !customerId,
  });

  if (loading) return <span className="text-muted-foreground">…</span>;
  if (!customer) return <span>—</span>;

  const { firstName, lastName, primaryEmail, primaryPhone } = customer;
  const fullName =
    firstName || lastName
      ? `${firstName || ''} ${lastName || ''}`.trim()
      : primaryEmail || primaryPhone || 'Unnamed customer';

  return <span>{fullName}</span>;
};

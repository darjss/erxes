import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  Button,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useQuery } from '@apollo/client';
import { useOneFitCustomers } from '../hooks/useOneFitCustomers';
import {
  OneFitCustomerFilters,
  OneFitMembershipStatus,
} from '../types/onefitCustomer';
import { ONEFIT_CUSTOMERS_CURSOR_SESSION_KEY } from '../constants/onefitCustomerCursorSessionKey';
import { useState, useMemo } from 'react';
import { UpdateMembershipDialog } from './UpdateMembershipDialog';
import { UpdateCreditBalanceDialog } from './UpdateCreditBalanceDialog';
import { UpdateBookingPreferencesDialog } from './UpdateBookingPreferencesDialog';
import { ONE_FIT_MEMBERSHIP_PLANS } from '~/modules/membership/graphql/membershipPlanQueries';
import { CreateMembershipPurchaseDialog } from '~/modules/membership-purchase/components/CreateMembershipPurchaseDialog';

interface OneFitCustomersListProps {
  filters?: OneFitCustomerFilters;
}

const getMembershipStatusBadgeVariant = (status?: OneFitMembershipStatus) => {
  switch (status) {
    case OneFitMembershipStatus.ACTIVE:
      return 'success';
    case OneFitMembershipStatus.EXPIRED:
      return 'destructive';
    case OneFitMembershipStatus.NONE:
      return 'secondary';
    default:
      return 'secondary';
  }
};

export const OneFitCustomersList = ({ filters }: OneFitCustomersListProps) => {
  const { customers, handleFetchMore, loading, pageInfo } =
    useOneFitCustomers(filters);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [membershipDialogOpen, setMembershipDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<
    'membership' | 'credit' | 'preferences' | 'purchase'
  >('membership');

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  // Fetch all membership plans to map IDs to names
  const { data: membershipPlansData } = useQuery(ONE_FIT_MEMBERSHIP_PLANS, {
    variables: { limit: 100 },
  });
  const membershipPlans =
    membershipPlansData?.oneFitMembershipPlans?.list || [];

  const membershipPlanMap = useMemo(() => {
    const map = new Map();
    membershipPlans.forEach((plan) => {
      map.set(plan._id, plan.name);
    });
    return map;
  }, [membershipPlans]);

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Name',
        cell: ({ row }) => {
          const customer = row.original;
          const name =
            customer.firstName || customer.lastName
              ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
              : customer.primaryEmail || customer.primaryPhone || 'Unknown';
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              {name}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'primaryEmail',
        header: 'Email',
        cell: ({ cell }) => {
          return (
            <RecordTableInlineCell className="text-xs text-muted-foreground">
              {(cell.getValue() as string) || '-'}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'primaryPhone',
        header: 'Phone',
        cell: ({ cell }) => {
          return (
            <RecordTableInlineCell className="text-xs text-muted-foreground">
              {(cell.getValue() as string) || '-'}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'oneFitMembershipPlanId',
        header: 'Membership Plan',
        cell: ({ row }) => {
          const planId = row.original.oneFitMembershipPlanId;
          const planName = planId ? membershipPlanMap.get(planId) : null;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              {planName || '-'}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'oneFitMembershipStatus',
        header: 'Membership Status',
        cell: ({ cell }) => {
          const status = cell.getValue() as OneFitMembershipStatus;
          return (
            <RecordTableInlineCell>
              <Badge
                variant={getMembershipStatusBadgeVariant(status)}
                className="capitalize"
              >
                {status || 'none'}
              </Badge>
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'oneFitMembershipExpiresAt',
        header: 'Membership Expires',
        cell: ({ cell }) => {
          const date = cell.getValue() as string;
          if (!date) return <RecordTableInlineCell>-</RecordTableInlineCell>;
          return (
            <RecordTableInlineCell>
              <RelativeDateDisplay value={date}>
                <RelativeDateDisplay.Value value={date} />
              </RelativeDateDisplay>
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'oneFitCurrentCreditBalance',
        header: 'Credit Balance',
        cell: ({ cell }) => {
          const balance = cell.getValue() as number;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              {balance ?? 0}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'oneFitTotalCreditsEarned',
        header: 'Total Credits Earned',
        cell: ({ cell }) => {
          const earned = cell.getValue() as number;
          return (
            <RecordTableInlineCell className="text-xs font-medium text-green-600">
              {earned ?? 0}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'oneFitTotalCreditsUsed',
        header: 'Total Credits Used',
        cell: ({ cell }) => {
          const used = cell.getValue() as number;
          return (
            <RecordTableInlineCell className="text-xs font-medium text-red-600">
              {used ?? 0}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'oneFitTotalBookings',
        header: 'Total Bookings',
        cell: ({ cell }) => {
          const count = cell.getValue() as number;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              {count ?? 0}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'oneFitLastBookingDate',
        header: 'Last Booking',
        cell: ({ cell }) => {
          const date = cell.getValue() as string;
          if (!date) return <RecordTableInlineCell>-</RecordTableInlineCell>;
          return (
            <RecordTableInlineCell>
              <RelativeDateDisplay value={date}>
                <RelativeDateDisplay.Value value={date} />
              </RelativeDateDisplay>
            </RecordTableInlineCell>
          );
        },
      },
      // {
      //   id: 'actions',
      //   header: 'Actions',
      //   cell: ({ row }) => {
      //     const customer = row.original;

      //     return (
      //       <RecordTableInlineCell>
      //         <div className="flex gap-2">
      //           <Button
      //             variant="outline"
      //             size="sm"
      //             onClick={() => {
      //               setSelectedCustomer(customer._id);
      //               setActionType('purchase');
      //               setPurchaseDialogOpen(true);
      //             }}
      //           >
      //             Purchase membership
      //           </Button>
      //         </div>
      //       </RecordTableInlineCell>
      //     );
      //   },
      // },
    ],
    [membershipPlanMap],
  );

  return (
    <>
      <div className="flex flex-col overflow-hidden h-full relative">
        <RecordTable.Provider
          columns={columns}
          data={customers || []}
          stickyColumns={['firstName']}
          className="m-3"
        >
          <RecordTable.CursorProvider
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            dataLength={customers?.length}
            sessionKey={ONEFIT_CUSTOMERS_CURSOR_SESSION_KEY}
          >
            <RecordTable>
              <RecordTable.Header />
              <RecordTable.Body>
                <RecordTable.CursorBackwardSkeleton
                  handleFetchMore={handleFetchMore}
                />
                {loading && <RecordTable.RowSkeleton rows={40} />}
                <RecordTable.RowList />
                <RecordTable.CursorForwardSkeleton
                  handleFetchMore={handleFetchMore}
                />
              </RecordTable.Body>
            </RecordTable>
          </RecordTable.CursorProvider>
        </RecordTable.Provider>
      </div>
      {selectedCustomer && (
        <>
          <UpdateMembershipDialog
            customerId={selectedCustomer}
            open={membershipDialogOpen && actionType === 'membership'}
            onOpenChange={(open) => {
              setMembershipDialogOpen(open);
              if (!open) setSelectedCustomer(null);
            }}
          />
          <UpdateCreditBalanceDialog
            customerId={selectedCustomer}
            open={creditDialogOpen && actionType === 'credit'}
            onOpenChange={(open) => {
              setCreditDialogOpen(open);
              if (!open) setSelectedCustomer(null);
            }}
          />
          <UpdateBookingPreferencesDialog
            customerId={selectedCustomer}
            open={preferencesDialogOpen && actionType === 'preferences'}
            onOpenChange={(open) => {
              setPreferencesDialogOpen(open);
              if (!open) setSelectedCustomer(null);
            }}
          />
          <CreateMembershipPurchaseDialog
            defaultUserId={selectedCustomer}
            open={purchaseDialogOpen && actionType === 'purchase'}
            onOpenChange={(open) => {
              setPurchaseDialogOpen(open);
              if (!open) setSelectedCustomer(null);
            }}
          />
        </>
      )}
    </>
  );
};

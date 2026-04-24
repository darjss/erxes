import { ColumnDef } from '@tanstack/table-core';
import { useQuery } from '@apollo/client';
import {
  Badge,
  Button,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useMemo, useState } from 'react';
import { OneFitCustomersInline } from '~/modules/onefitCustomer/components/OneFitCustomersInline';
import { ONE_FIT_MEMBERSHIP_PURCHASES } from '../graphql/membershipPurchaseQueries';
import { useMembershipPurchases } from '../hooks/useMembershipPurchases';
import {
  MembershipPurchaseFilters,
  OneFitMembershipPurchase,
} from '../types/membershipPurchase';
import { MEMBERSHIP_PURCHASES_CURSOR_SESSION_KEY } from '../constants/membershipPurchaseCursorSessionKey';
import { ActivateMembershipPurchaseDialog } from './ActivateMembershipPurchaseDialog';
import { QrCodeDialog } from './QrCodeDialog';

interface MembershipPurchasesListProps {
  filters?: MembershipPurchaseFilters;
  onFiltersChange?: (filters: MembershipPurchaseFilters) => void;
}

function getStatusBadgeVariant(status?: OneFitMembershipPurchase['status']) {
  switch (status) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'cancelled':
      return 'default';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export function MembershipPurchasesList({
  filters,
  onFiltersChange,
}: MembershipPurchasesListProps) {
  const { membershipPurchases, handleFetchMore, loading, pageInfo } =
    useMembershipPurchases(filters);
  const { data: needActivationData } = useQuery(ONE_FIT_MEMBERSHIP_PURCHASES, {
    variables: {
      isNeedActivation: true,
      limit: 1,
    },
  });

  const needActivationCount =
    needActivationData?.oneFitMembershipPurchases?.totalCount || 0;
  const isNeedActivationFiltered = filters?.isNeedActivation === true;

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    null,
  );
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedQrData, setSelectedQrData] = useState<string | null>(null);

  const columns: ColumnDef<OneFitMembershipPurchase>[] = useMemo(
    () => [
      RecordTable.checkboxColumn as ColumnDef<OneFitMembershipPurchase>,
      {
        id: 'user',
        header: 'Customer',
        cell: ({ row }) => {
          const purchase = row.original;
          const userId = purchase.userId;
          const user = purchase.user;

          if (!userId) {
            return (
              <RecordTableInlineCell className="text-xs text-muted-foreground">
                -
              </RecordTableInlineCell>
            );
          }
          return (
            <RecordTableInlineCell>
              {user ? (
                <OneFitCustomersInline
                  customers={[
                    {
                      _id: user._id,
                      createdAt: '',
                      updatedAt: '',
                      firstName: user.firstName,
                      lastName: user.lastName,
                      primaryEmail: user.primaryEmail,
                      primaryPhone: user.primaryPhone,
                    },
                  ]}
                  placeholder="Unnamed customer"
                />
              ) : (
                <OneFitCustomersInline customerIds={[userId]} />
              )}
            </RecordTableInlineCell>
          );
        },
      },
      {
        id: 'plan',
        header: 'Plan',
        cell: ({ row }) => {
          const purchase = row.original;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              {purchase.plan?.name || '-'}
            </RecordTableInlineCell>
          );
        },
      },
      {
        id: 'promoCode',
        header: 'Promo code',
        cell: ({ row }) => {
          const purchase = row.original;
          const code = purchase.promoCode?.code;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              {code ?? '-'}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ cell }) => {
          const amount = cell.getValue() as number;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              {(amount ?? 0).toLocaleString()} MNT
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ cell }) => {
          const status = cell.getValue() as OneFitMembershipPurchase['status'];
          return (
            <RecordTableInlineCell>
              <Badge
                variant={getStatusBadgeVariant(status)}
                className="capitalize"
              >
                {status || 'pending'}
              </Badge>
            </RecordTableInlineCell>
          );
        },
      },
      {
        id: 'invoiceStatus',
        header: 'Invoice',
        cell: ({ row }) => {
          const invoiceStatus = row.original.invoice?.status as
            | string
            | undefined;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              {invoiceStatus ? (
                <Badge
                  variant={invoiceStatus === 'paid' ? 'success' : 'secondary'}
                  className="capitalize"
                >
                  {invoiceStatus}
                </Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'purchasedAt',
        header: 'Purchased',
        cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (!value) return <RecordTableInlineCell>-</RecordTableInlineCell>;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              <RelativeDateDisplay value={value}>
                <RelativeDateDisplay.Value value={value} />
              </RelativeDateDisplay>
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'paidAt',
        header: 'Paid',
        cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (!value) return <RecordTableInlineCell>-</RecordTableInlineCell>;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              <RelativeDateDisplay value={value}>
                <RelativeDateDisplay.Value value={value} />
              </RelativeDateDisplay>
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'activatedAt',
        header: 'Activated',
        cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (!value) return <RecordTableInlineCell>-</RecordTableInlineCell>;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              <RelativeDateDisplay value={value}>
                <RelativeDateDisplay.Value value={value} />
              </RelativeDateDisplay>
            </RecordTableInlineCell>
          );
        },
      },
      {
        accessorKey: 'expiresAt',
        header: 'Expires',
        cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (!value) return <RecordTableInlineCell>-</RecordTableInlineCell>;
          return (
            <RecordTableInlineCell className="text-xs font-medium">
              <RelativeDateDisplay value={value}>
                <RelativeDateDisplay.Value value={value} />
              </RelativeDateDisplay>
            </RecordTableInlineCell>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const purchase = row.original;
          const canActivate =
            purchase.status === 'paid' && !purchase.activatedAt;
          const invoiceStatus = purchase.invoice?.status as string | undefined;
          const invoicePending = invoiceStatus === 'pending';
          const qrData = purchase.invoice?.transactions?.[0]?.response
            ?.qrData as string | undefined;
          const showQrButton = invoicePending && qrData;

          return (
            <RecordTableInlineCell>
              <div className="flex gap-2">
                {showQrButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedQrData(qrData);
                      setQrDialogOpen(true);
                    }}
                  >
                    Show QR Code
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canActivate}
                  onClick={() => {
                    setSelectedPurchaseId(purchase._id);
                    setActivateDialogOpen(true);
                  }}
                >
                  Activate
                </Button>
              </div>
            </RecordTableInlineCell>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      {needActivationCount > 0 && (
        <div className="mx-3 mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <button
            type="button"
            className="font-medium underline underline-offset-2"
            onClick={() =>
              onFiltersChange?.({
                ...(filters || {}),
                status: undefined,
                isActivated: undefined,
                isPaidNotActivated: undefined,
                isNeedActivation: !isNeedActivationFiltered,
              })
            }
          >
            {needActivationCount} customer
            {needActivationCount > 1 ? 's' : ''} need activation
          </button>{' '}
          (expires today or past due)
        </div>
      )}

      <RecordTable.Provider
        columns={columns}
        data={membershipPurchases || []}
        className="m-3"
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          dataLength={membershipPurchases?.length}
          sessionKey={MEMBERSHIP_PURCHASES_CURSOR_SESSION_KEY}
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

      {selectedPurchaseId && (
        <ActivateMembershipPurchaseDialog
          purchaseId={selectedPurchaseId}
          open={activateDialogOpen}
          onOpenChange={setActivateDialogOpen}
          onClose={() => {
            setActivateDialogOpen(false);
            setSelectedPurchaseId(null);
          }}
        />
      )}

      {selectedQrData && (
        <QrCodeDialog
          qrData={selectedQrData}
          open={qrDialogOpen}
          onOpenChange={setQrDialogOpen}
          onClose={() => {
            setQrDialogOpen(false);
            setSelectedQrData(null);
          }}
        />
      )}
    </>
  );
}

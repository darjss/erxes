import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  Button,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useState } from 'react';
import { useRegistrations } from '@/registration/hooks/useRegistrations';
import { REGISTRATIONS_CURSOR_SESSION_KEY } from '@/registration/constants/registrationsCursorSessionKey';
import { RegistrationFilters as RegistrationFiltersType } from '@/registration/types/registrationFilters';
import { RegistrationDetailSheet } from '@/registration/components/RegistrationDetailSheet';

interface RegistrationsListProps {
  filters?: RegistrationFiltersType;
}

function statusBadgeVariant(status: string) {
  switch (status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'destructive';
    case 'submitted':
      return 'default';
    case 'under_review':
      return 'warning';
    case 'draft':
      return 'secondary';
    default:
      return 'secondary';
  }
}

export function RegistrationsList({ filters }: RegistrationsListProps) {
  const {
    registrations,
    handleFetchMore,
    loading,
    pageInfo,
    refetch,
  } = useRegistrations(filters);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const columns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: 'membershipTypeTitle',
      header: 'Төрөл',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-sm font-medium max-w-[240px]">
          {(cell.getValue() as string) || '—'}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'membershipTypeId',
      header: 'ID төрөл',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="font-mono text-xs">
          {cell.getValue() as string}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'schemaVersion',
      header: 'Хувилбар',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="font-mono text-xs">
          {cell.getValue() as string}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Төлөв',
      cell: ({ cell }) => {
        const status = cell.getValue() as string;
        return (
          <RecordTableInlineCell>
            <Badge variant={statusBadgeVariant(status)} className="capitalize">
              {status}
            </Badge>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Огноо',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs">
          <RelativeDateDisplay value={cell.getValue() as string} asChild>
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RelativeDateDisplay>
        </RecordTableInlineCell>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const id = row.original._id as string;
        return (
          <RecordTableInlineCell>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setDetailId(id);
                setDetailOpen(true);
              }}
            >
              Дэлгэрэнгүй
            </Button>
          </RecordTableInlineCell>
        );
      },
    },
  ];

  return (
    <>
      <RecordTable.Provider
        columns={columns}
        data={registrations || []}
        className="m-3"
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          dataLength={registrations?.length}
          sessionKey={REGISTRATIONS_CURSOR_SESSION_KEY}
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

      <RegistrationDetailSheet
        applicationId={detailId}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailId(null);
        }}
        onSaved={() => {
          void refetch();
        }}
      />
    </>
  );
}

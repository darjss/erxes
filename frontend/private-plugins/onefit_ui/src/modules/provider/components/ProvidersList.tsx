import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  Button,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useProviders } from '../hooks/useProviders';
import { ProviderFilters, ProviderStatus } from '../types/provider';
import { PROVIDERS_CURSOR_SESSION_KEY } from '../constants/providerCursorSessionKey';
import { EditProviderDialog } from './ProviderDialog';
import { ApproveProviderDialog } from './ApproveProviderDialog';
import { RejectProviderDialog } from './RejectProviderDialog';
import { RemoveProviderDialog } from './RemoveProviderDialog';
import { useState } from 'react';
import { getLocalizedString } from '~/modules/activity-type/utils/localization';

interface ProvidersListProps {
  filters?: ProviderFilters;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case ProviderStatus.PENDING:
      return 'warning';
    case ProviderStatus.APPROVED:
      return 'success';
    case ProviderStatus.REJECTED:
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const ProvidersList = ({ filters }: ProvidersListProps) => {
  const { providers, handleFetchMore, loading, pageInfo } =
    useProviders(filters);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'businessName',
      header: 'Business Name',
      cell: ({ cell }) => {
        const businessName = cell.getValue() as
          | { en: string; mn: string }
          | undefined;
        const name = getLocalizedString(businessName, 'en');
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {name}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ cell }) => {
        const description = cell.getValue() as
          | { en?: string; mn?: string }
          | undefined;
        const desc = getLocalizedString(description, 'en');
        return (
          <RecordTableInlineCell className="text-xs font-medium text-muted-foreground max-w-xs truncate">
            {desc || '-'}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ cell }) => {
        const location = cell.getValue() as {
          city: { en: string; mn: string };
          address: { en: string; mn: string };
        } | null;
        const city = getLocalizedString(location?.city, 'en');
        const address = getLocalizedString(location?.address, 'en');
        return (
          <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
            {city && address ? `${city}, ${address}` : '-'}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'contactInfo',
      header: 'Contact',
      cell: ({ cell }) => {
        const contactInfo = cell.getValue() as {
          phone: string;
          email: string;
        };
        return (
          <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
            <div>{contactInfo?.phone}</div>
            <div>{contactInfo?.email}</div>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'categoryIds',
      header: 'Categories',
      cell: ({ cell }) => {
        const categoryIds = cell.getValue() as string[];
        return (
          <RecordTableInlineCell>
            <div className="flex flex-wrap gap-1">
              {categoryIds?.length > 0
                ? categoryIds.map((id) => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {id}
                    </Badge>
                  ))
                : '-'}
            </div>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ cell }) => {
        const status = cell.getValue() as string;
        return (
          <RecordTableInlineCell>
            <Badge
              variant={getStatusBadgeVariant(status)}
              className="capitalize"
            >
              {status}
            </Badge>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ cell }) => {
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            <RelativeDateDisplay value={cell.getValue() as string} asChild>
              <RelativeDateDisplay.Value value={cell.getValue() as string} />
            </RelativeDateDisplay>
          </RecordTableInlineCell>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const provider = row.original;

        return (
          <RecordTableInlineCell>
            <div className="flex gap-2 flex-wrap">
              {(provider.status === ProviderStatus.PENDING ||
                provider.status === ProviderStatus.APPROVED) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProvider(provider._id);
                    setEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
              )}
              {provider.status === ProviderStatus.PENDING && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProvider(provider._id);
                      setApproveDialogOpen(true);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProvider(provider._id);
                      setRejectDialogOpen(true);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProvider(provider._id);
                  setRemoveDialogOpen(true);
                }}
              >
                Remove
              </Button>
            </div>
          </RecordTableInlineCell>
        );
      },
    },
  ];

  return (
    <>
      <RecordTable.Provider
        columns={columns}
        data={providers || []}
        className="m-3"
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          dataLength={providers?.length}
          sessionKey={PROVIDERS_CURSOR_SESSION_KEY}
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

      {selectedProvider && (
        <>
          <EditProviderDialog
            providerId={selectedProvider}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedProvider(null);
            }}
          />
          <ApproveProviderDialog
            providerId={selectedProvider}
            open={approveDialogOpen}
            onOpenChange={setApproveDialogOpen}
            onClose={() => {
              setApproveDialogOpen(false);
              setSelectedProvider(null);
            }}
          />
          <RejectProviderDialog
            providerId={selectedProvider}
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            onClose={() => {
              setRejectDialogOpen(false);
              setSelectedProvider(null);
            }}
          />
          <RemoveProviderDialog
            providerId={selectedProvider}
            open={removeDialogOpen}
            onOpenChange={setRemoveDialogOpen}
            onClose={() => {
              setRemoveDialogOpen(false);
              setSelectedProvider(null);
            }}
          />
        </>
      )}
    </>
  );
};

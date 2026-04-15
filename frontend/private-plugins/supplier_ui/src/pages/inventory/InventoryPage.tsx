import {
  Breadcrumb,
  Button,
  PageSubHeader,
  Separator,
  toast,
  AlertDialog,
} from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IconClipboardList, IconPlus, IconTrash } from '@tabler/icons-react';
import { InventoryTable } from '@/inventory/components/InventoryTable';
import { InventoryForm } from '@/inventory/components/InventoryForm';
import { InventoryFilter } from '@/inventory/components/InventoryFilter';
import { InventoryDetailSheet } from '@/inventory/components/InventoryDetailSheet';
import { useGetSupplier } from '@/profile/hooks/useSupplier';
import { useRemoveInventoryItem } from '@/inventory/hooks/useInventoryMutations';
import { useInventoryItems } from '@/inventory/hooks/useInventoryItems';

export const InventoryPage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { supplier } = useGetSupplier();
  const supplierId = supplier?._id;

  const { totalCount } = useInventoryItems(supplierId);
  const { removeItem, loading: removing } = useRemoveInventoryItem();

  const handleRemove = () => {
    if (!selectedId || !supplierId) return;
    removeItem({
      variables: { _id: selectedId, supplierId },
      onCompleted: () => {
        toast({ title: 'Item removed' });
        setRemoveOpen(false);
        setSelectedId(null);
      },
      onError: (err) => {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/supplier/inventory">
                    <IconClipboardList />
                    Inventory
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          {selectedId && (
            <Button variant="destructive" onClick={() => setRemoveOpen(true)}>
              <IconTrash className="mr-1 size-4" />
              Remove
            </Button>
          )}
          <Button
            onClick={() => {
              setEditItem(null);
              setFormOpen(true);
            }}
            disabled={!supplierId}
          >
            <IconPlus className="mr-1 size-4" />
            Add item
          </Button>
        </PageHeader.End>
      </PageHeader>

      <PageSubHeader>
        <InventoryFilter />
      </PageSubHeader>

      <div className="flex-1 overflow-auto">
        <InventoryTable supplierId={supplierId} />
      </div>

      {supplierId && (
        <InventoryForm
          supplierId={supplierId}
          open={formOpen}
          onOpenChange={setFormOpen}
          editItem={editItem}
        />
      )}

      <InventoryDetailSheet supplierId={supplierId} />

      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Remove inventory item?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onClick={handleRemove} disabled={removing}>
              {removing ? 'Removing…' : 'Remove'}
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </div>
  );
};

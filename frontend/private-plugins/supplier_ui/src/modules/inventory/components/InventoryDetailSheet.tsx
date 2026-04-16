import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Spinner,
  Table,
  useQueryState,
} from 'erxes-ui';
import { useState } from 'react';
import { format } from 'date-fns';
import { useInventoryDetail } from '../hooks/useInventoryDetail';
import { useProductDetail } from '../hooks/useProductDetail';
import { IInventoryItem } from '../types';
import { InventoryForm } from './InventoryForm';

const statusVariant = (status?: string) => {
  if (status === 'active') return 'success' as const;
  if (status === 'out_of_stock') return 'destructive' as const;
  return 'secondary' as const;
};

const Row = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) => (
  <Table.Row>
    <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
      {label}
    </Table.Cell>
    <Table.Cell className="p-2 h-auto min-h-10 whitespace-normal">
      {value ?? '-'}
    </Table.Cell>
  </Table.Row>
);

const InventoryInfo = ({
  item,
  supplierId,
}: {
  item: IInventoryItem;
  supplierId: string;
}) => {
  const product = useProductDetail(item.productId);

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="Product">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row label="Name" value={product?.name} />
              <Row label="SKU" value={product?.code} />
              <Row
                label="Unit price"
                value={
                  product?.unitPrice != null
                    ? product.unitPrice.toLocaleString()
                    : null
                }
              />
              <Row label="Unit" value={product?.uom} />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      <InfoCard title="Stock">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row
                label="Quantity"
                value={
                  <span
                    className={
                      item.isBelowSafeRemainder
                        ? 'text-destructive font-medium'
                        : ''
                    }
                  >
                    {item.quantity}
                  </span>
                }
              />
              <Row label="Safe minimum" value={item.safeRemainder} />
              <Row
                label="Low stock"
                value={
                  item.isBelowSafeRemainder ? (
                    <Badge variant="destructive">Yes</Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )
                }
              />
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
                  Status
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                  <Badge variant={statusVariant(item.status)}>
                    {item.status || 'active'}
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Row label="Barcode" value={item.barcode} />
              <Row label="Notes" value={item.notes} />
              <Row
                label="Created"
                value={
                  item.createdAt
                    ? format(new Date(item.createdAt), 'dd.MM.yyyy HH:mm')
                    : null
                }
              />
              <Row
                label="Updated"
                value={
                  item.updatedAt
                    ? format(new Date(item.updatedAt), 'dd.MM.yyyy HH:mm')
                    : null
                }
              />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>
    </div>
  );
};

export const InventoryDetailSheet = ({
  supplierId,
}: {
  supplierId?: string;
}) => {
  const [activeItemId, setActiveItemId] = useQueryState<string>('activeInventoryId');
  const [editOpen, setEditOpen] = useState(false);
  const { item, loading } = useInventoryDetail(activeItemId);

  return (
    <>
      <FocusSheet
        open={!!activeItemId}
        onOpenChange={() => setActiveItemId(null)}
      >
        <FocusSheet.View className="sm:max-w-lg">
          <FocusSheet.Header title="Inventory Item" />
          <FocusSheet.Content className="flex flex-auto overflow-hidden">
            <ScrollArea className="flex-auto h-full">
              <div className="p-4">
                {loading && <Spinner />}
                {!loading && item && supplierId && (
                  <InventoryInfo item={item} supplierId={supplierId} />
                )}
                {!loading && !item && <div>Item not found</div>}
              </div>
            </ScrollArea>
          </FocusSheet.Content>
          <Sheet.Footer className="flex-none">
            {item && supplierId && (
              <Button onClick={() => setEditOpen(true)}>Edit</Button>
            )}
            <Sheet.Close asChild>
              <Button variant="secondary" className="bg-border">
                Close
              </Button>
            </Sheet.Close>
          </Sheet.Footer>
        </FocusSheet.View>
      </FocusSheet>

      {item && supplierId && (
        <InventoryForm
          supplierId={supplierId}
          open={editOpen}
          onOpenChange={setEditOpen}
          editItem={item}
        />
      )}
    </>
  );
};

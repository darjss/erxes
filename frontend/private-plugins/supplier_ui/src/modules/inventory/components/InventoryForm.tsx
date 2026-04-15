import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FocusSheet,
  Form,
  Input,
  Select,
  Sheet,
  Textarea,
  toast,
} from 'erxes-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { IInventoryItem, InventoryItemFormValues } from '../types';
import {
  useCreateInventoryItem,
  useUpdateInventoryItem,
} from '../hooks/useInventoryMutations';
import { SelectProduct } from 'ui-modules';
import { useProductDetail } from '../hooks/useProductDetail';

const STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Out of stock', value: 'out_of_stock' },
];

const inventorySchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  barcode: z.string().optional(),
  quantity: z.coerce.number().min(0, 'Quantity must be 0 or more'),
  safeRemainder: z.coerce.number().min(0).optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

interface InventoryFormProps {
  supplierId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: IInventoryItem | null;
}

export const InventoryForm = ({
  supplierId,
  open,
  onOpenChange,
  editItem,
}: InventoryFormProps) => {
  const { createItem, loading: creating } = useCreateInventoryItem();
  const { updateItem, loading: updating } = useUpdateInventoryItem();
  const isEditing = !!editItem;
  const saving = creating || updating;

  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: { productId: '', quantity: 0, status: 'active' },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editItem
          ? {
              productId: editItem.productId,
              barcode: editItem.barcode,
              quantity: editItem.quantity,
              safeRemainder: editItem.safeRemainder,
              status: editItem.status || 'active',
              notes: editItem.notes,
            }
          : { productId: '', quantity: 0, status: 'active' },
      );
    }
  }, [open, editItem, form]);

  const productId = form.watch('productId');
  const product = useProductDetail(productId);

  const onSubmit = (values: InventoryItemFormValues) => {
    const onCompleted = () => {
      toast({ title: isEditing ? 'Item updated' : 'Item created' });
      onOpenChange(false);
    };
    const onError = (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    };

    if (isEditing) {
      updateItem({
        variables: { _id: editItem._id, supplierId, input: values },
        onCompleted,
        onError,
      });
    } else {
      createItem({
        variables: { supplierId, input: values },
        onCompleted,
        onError,
      });
    }
  };

  return (
    <FocusSheet modal open={open} onOpenChange={onOpenChange}>
      <FocusSheet.View className="sm:max-w-lg">
        <FocusSheet.Header
          title={isEditing ? 'Edit inventory item' : 'Add inventory item'}
        />
        <FocusSheet.Content className="flex-1 min-h-0">
          <div className="flex flex-col flex-1 overflow-auto">
            <Form {...form}>
              <form
                id="inventory-item-form"
                className="gap-4 grid grid-cols-2 p-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <Form.Field
                  name="productId"
                  control={form.control}
                  render={() => (
                    <Form.Item className="col-span-2">
                      <Form.Label>Product *</Form.Label>
                      <SelectProduct
                        mode="single"
                        value={productId}
                        onValueChange={(id) =>
                          form.setValue('productId', id as string, {
                            shouldDirty: true,
                          })
                        }
                      />
                      <Form.Message />
                    </Form.Item>
                  )}
                />

                {product && (
                  <div className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-1 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                    {product.code && (
                      <>
                        <span className="text-muted-foreground">SKU</span>
                        <span>{product.code}</span>
                      </>
                    )}
                    {product.unitPrice != null && (
                      <>
                        <span className="text-muted-foreground">Unit price</span>
                        <span>{product.unitPrice.toLocaleString()}</span>
                      </>
                    )}
                    {product.uom && (
                      <>
                        <span className="text-muted-foreground">Unit</span>
                        <span>{product.uom}</span>
                      </>
                    )}
                  </div>
                )}

                <Form.Field
                  name="quantity"
                  control={form.control}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Quantity *</Form.Label>
                      <Form.Control>
                        <Input type="number" min={0} {...field} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  name="safeRemainder"
                  control={form.control}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Safe minimum</Form.Label>
                      <Form.Control>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ''}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  name="barcode"
                  control={form.control}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Barcode</Form.Label>
                      <Form.Control>
                        <Input {...field} value={field.value || ''} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Status</Form.Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <Form.Control>
                          <Select.Trigger>
                            <Select.Value placeholder="Select status" />
                          </Select.Trigger>
                        </Form.Control>
                        <Select.Content>
                          {STATUSES.map((s) => (
                            <Select.Item key={s.value} value={s.value}>
                              {s.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                      <Form.Message />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <Form.Item className="col-span-2">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control>
                        <Textarea {...field} value={field.value || ''} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
              </form>
            </Form>
          </div>
        </FocusSheet.Content>
        <Sheet.Footer className="flex justify-end gap-2 p-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" form="inventory-item-form" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Update' : 'Create'}
          </Button>
        </Sheet.Footer>
      </FocusSheet.View>
    </FocusSheet>
  );
};

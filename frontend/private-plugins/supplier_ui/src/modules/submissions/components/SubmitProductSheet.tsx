import { useState } from 'react';
import {
  Button,
  FocusSheet,
  Form,
  InfoCard,
  NumberInput,
  Resizable,
  Sheet,
} from 'erxes-ui';
import { useFieldArray, useForm } from 'react-hook-form';
import { IconPlus } from '@tabler/icons-react';
import { ProductsInline } from 'ui-modules';
import { SelectProductContent, SelectProductProvider } from './SelectProduct';
import { useSubmissionMutations } from '../hooks/useSubmissionMutations';
import { ISubmissionOffering } from '../types';

interface ProductRow {
  productId: string;
  offering: ISubmissionOffering;
}

interface FormValues {
  items: ProductRow[];
}

interface Props {
  trigger?: React.ReactNode;
  defaultProductId?: string;
  onCompleted?: () => void;
}

const OFFERING_FIELDS: {
  name: keyof ISubmissionOffering;
  label: string;
  placeholder: string;
  max?: number;
  minLength?: number;
  maxLength?: number;
}[] = [
  { name: 'price', label: 'Price', placeholder: 'Sale price' },
  { name: 'stock', label: 'Stock', placeholder: 'Units' },
  { name: 'minBuyCount', label: 'Min buy', placeholder: 'Min qty' },
  { name: 'maxBuyCount', label: 'Max buy', placeholder: 'Max qty' },
  {
    name: 'groupBuyMinCount',
    label: 'Group buy min',
    placeholder: 'Min count',
  },
  {
    name: 'groupBuyDiscount',
    label: 'Group discount %',
    placeholder: '0-100 %',
    max:100,
    maxLength: 3,
    minLength: 1,
  },
  { name: 'warrantyDuration', label: 'Warranty (mo)', placeholder: 'Months' },
];

export const SubmitProductSheet = ({
  trigger,
  defaultProductId,
  onCompleted,
}: Props) => {
  const [open, setOpen] = useState(false);
  const isResubmit = Boolean(defaultProductId);

  const { submitBulk, resubmitProduct, submittingBulk, resubmitting } =
    useSubmissionMutations();
  const loading = submittingBulk || resubmitting;

  const form = useForm<FormValues>({
    defaultValues: {
      items: defaultProductId
        ? [{ productId: defaultProductId, offering: {} }]
        : [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const selectedIds = fields.map((f) => f.productId);

  const handleOpen = (next: boolean) => {
    if (next) {
      form.reset({
        items: defaultProductId
          ? [{ productId: defaultProductId, offering: {} }]
          : [],
      });
    }
    setOpen(next);
  };

  const handleProductSelect = (
    product: { _id: string; unitPrice?: number },
    selected: boolean,
  ) => {
    if (selected) {
      append({
        productId: product._id,
        offering: { price: product.unitPrice ?? undefined },
      });
    } else {
      const index = fields.findIndex((f) => f.productId === product._id);
      if (index !== -1) remove(index);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    const valid = values.items.filter((i) => i.productId);
    if (!valid.length) return;

    if (isResubmit) {
      const { productId, offering } = valid[0];
      await resubmitProduct({ variables: { productId, offering } });
    } else {
      await submitBulk({
        variables: {
          items: valid.map(({ productId, offering }) => ({
            productId,
            offering,
          })),
        },
      });
    }

    setOpen(false);
    onCompleted?.();
  };

  const defaultTrigger = (
    <Button>
      <IconPlus className="mr-1 size-4" />
      Submit products
    </Button>
  );

  return (
    <FocusSheet open={open} onOpenChange={handleOpen}>
      <Sheet.Trigger asChild>{trigger ?? defaultTrigger}</Sheet.Trigger>
      <FocusSheet.View>
        <FocusSheet.Header
          title={
            isResubmit ? 'Resubmit product' : 'Submit products to platform'
          }
        />

        <FocusSheet.Content className="flex-1 min-h-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-1 min-h-0 overflow-hidden"
            >
              <Resizable.PanelGroup
                direction="horizontal"
                className="flex-1 min-h-0"
              >
              {/* Sidebar: product list */}
              {!isResubmit && (
                <>
                  <Resizable.Panel
                    defaultSize={25}
                    minSize={15}
                    maxSize={35}
                    className="min-h-0"
                  >
                    <div className="flex h-full min-h-0 flex-col p-2">
                      <InfoCard title="Products" className="h-full">
                        <InfoCard.Content className="flex-1 p-0 min-h-0 overflow-hidden">
                          <SelectProductProvider
                            value={selectedIds}
                            onProductSelect={handleProductSelect}
                          >
                            <SelectProductContent className="h-full" />
                          </SelectProductProvider>
                        </InfoCard.Content>
                      </InfoCard>
                    </div>
                  </Resizable.Panel>
                  <Resizable.Handle />
                </>
              )}

              {/* Offering fields */}
              <Resizable.Panel className="min-h-0">
                <div className="flex h-full min-h-0 flex-col bg-background">
                  <div className="flex-1 p-4 min-h-0">
                    <InfoCard title="Offering" className="h-full">
                      <InfoCard.Content className="flex flex-col gap-0 p-0 overflow-hidden">
                        <div className="shrink-0 px-3 py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-40 shrink-0 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              Product
                            </div>
                            <div className="flex min-w-0 flex-1 gap-2">
                              {OFFERING_FIELDS.map(({ name, label }) => (
                                <div
                                  key={name}
                                  className="flex-1 min-w-0 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                                >
                                  <span className="block truncate">{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 divide-y overflow-y-auto">
                          {fields.length === 0 ? (
                            <p className="py-10 text-muted-foreground text-sm text-center">
                              {isResubmit
                                ? 'Fill in the offering details below'
                                : 'Select products from the left panel'}
                            </p>
                          ) : (
                            fields.map((field, index) => (
                              <div
                                key={field.id}
                                className="flex items-center gap-3 px-3 py-2"
                              >
                                <div className="w-40 font-medium text-sm truncate shrink-0">
                                  <ProductsInline
                                    productIds={[field.productId]}
                                    placeholder="Product"
                                  />
                                </div>
                                <div className="flex flex-1 gap-2 min-w-0 items-start">
                                  {OFFERING_FIELDS.map(
                                    ({ name, placeholder, ...attributes }) => (
                                      <Form.Field
                                        key={name}
                                        control={form.control}
                                        name={`items.${index}.offering.${name}`}
                                        render={({ field: f }) => (
                                          <Form.Item className="flex-1 min-w-0 space-y-1">
                                            <Form.Control>
                                              <NumberInput
                                                value={f.value}
                                                onChange={f.onChange}
                                                placeholder={placeholder}
                                                disabled={name === 'price'}
                                                {...attributes}
                                              />
                                            </Form.Control>
                                            <Form.Message className="text-[10px] leading-tight" />
                                          </Form.Item>
                                        )}
                                      />
                                    ),
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </InfoCard.Content>
                    </InfoCard>
                  </div>

                  <Sheet.Footer className="bg-background px-5 py-4 border-t shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading || !fields.length}>
                      {loading
                        ? isResubmit
                          ? 'Resubmitting…'
                          : 'Submitting…'
                        : isResubmit
                        ? 'Resubmit'
                        : `Submit${
                            fields.length > 1
                              ? ` ${fields.length} products`
                              : ''
                          }`}
                    </Button>
                  </Sheet.Footer>
                </div>
              </Resizable.Panel>
            </Resizable.PanelGroup>
          </form>
        </Form>
        </FocusSheet.Content>
      </FocusSheet.View>
    </FocusSheet>
  );
};

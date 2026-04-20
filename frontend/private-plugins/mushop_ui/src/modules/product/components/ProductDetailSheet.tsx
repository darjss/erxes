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
import { ProductCategoryAssign } from './ProductCategoryAssign';
import { format } from 'date-fns';
import { useMushopProductDetail } from '../hooks/useMushopProductDetail';
import { IMushopProduct } from '../types';
import { ProductStatusAction } from './ProductStatusAction';

const statusVariant = (status?: string) => {
  if (status === 'approved') return 'success' as const;
  if (status === 'rejected') return 'destructive' as const;
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

const ProductInfo = ({ product }: { product: IMushopProduct }) => {
  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="General">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row label="Name" value={product.name} />
              <Row label="Short Name" value={product.shortName} />
              <Row label="Code" value={product.code} />
              <Row label="Type" value={product.type} />
              <Row label="Description" value={product.description} />
              <Row
                label="Unit Price"
                value={
                  product.unitPrice != null
                    ? product.unitPrice.toLocaleString()
                    : null
                }
              />
              <Row label="UOM" value={product.uom} />
              <Row label="Currency" value={product.currency} />
              <Row label="Supplier" value={product.supplier?.name || product.vendorId} />
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
                  Category
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10">
                  <ProductCategoryAssign.Provider
                    productId={product._id}
                    categoryId={product.categoryId}
                    category={product.category}
                    initialCategory={product.initialCategory}
                  >
                    <ProductCategoryAssign.DetailTrigger />
                  </ProductCategoryAssign.Provider>
                </Table.Cell>
              </Table.Row>
              <Row
                label="Barcodes"
                value={product.barcodes?.join(', ') || null}
              />
              <Row
                label="Barcode Description"
                value={product.barcodeDescription}
              />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      <InfoCard title="Status">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
                  Status
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                  <ProductStatusAction
                    productId={product._id}
                    status={product.status}
                  >
                    <Badge variant={statusVariant(product.status)} className='cursor-pointer'>
                      {product.status || 'pending'}
                    </Badge>
                  </ProductStatusAction>
                </Table.Cell>
              </Table.Row>
              <Row
                label="Created"
                value={
                  product.createdAt
                    ? format(new Date(product.createdAt), 'dd.MM.yyyy HH:mm')
                    : null
                }
              />
              <Row
                label="Updated"
                value={
                  product.updatedAt
                    ? format(new Date(product.updatedAt), 'dd.MM.yyyy HH:mm')
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

export const ProductDetailSheet = () => {
  const [activeProductId, setActiveProductId] =
    useQueryState<string>('activeProductId');
  const { product, loading } = useMushopProductDetail(activeProductId);

  return (
    <FocusSheet
      open={!!activeProductId}
      onOpenChange={() => setActiveProductId(null)}
    >
      <FocusSheet.View className="sm:max-w-2xl">
        <FocusSheet.Header title={product?.name || 'Product Detail'} />
        <FocusSheet.Content className="flex flex-auto overflow-hidden">
          <ScrollArea className="flex-auto h-full">
            <div className="p-4">
              {loading && <Spinner />}
              {!loading && product && <ProductInfo product={product} />}
              {!loading && !product && <div>Product not found</div>}
            </div>
          </ScrollArea>
        </FocusSheet.Content>
        <Sheet.Footer className="flex-none">
          <Sheet.Close asChild>
            <Button variant="secondary" className="bg-border">
              Close
            </Button>
          </Sheet.Close>
        </Sheet.Footer>
      </FocusSheet.View>
    </FocusSheet>
  );
};

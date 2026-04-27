import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Sidebar,
  Spinner,
  Table,
  Tabs,
  useQueryState,
} from 'erxes-ui';
import { ActivityLogs } from 'ui-modules';
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

const ProductInfo = ({ product }: { product: IMushopProduct & { _id: string } }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
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
              <Row label="Barcodes" value={product.barcodes?.join(', ') || null} />
              <Row label="Barcode Description" value={product.barcodeDescription} />
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
                  <ProductStatusAction productId={product._id} status={product.status}>
                    <Badge variant={statusVariant(product.status)} className="cursor-pointer">
                      {product.status || 'pending'}
                    </Badge>
                  </ProductStatusAction>
                </Table.Cell>
              </Table.Row>
              <Row
                label="Created"
                value={product.createdAt ? format(new Date(product.createdAt), 'dd.MM.yyyy HH:mm') : null}
              />
              <Row
                label="Updated"
                value={product.updatedAt ? format(new Date(product.updatedAt), 'dd.MM.yyyy HH:mm') : null}
              />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>
    </div>
  );
};

const TABS = ['overview', 'activity'] as const;

export const ProductDetailSheet = () => {
  const [activeProductId, setActiveProductId] = useQueryState<string>('activeProductId');
  const [tab, setTab] = useQueryState<string>('productTab');
  const { product, loading } = useMushopProductDetail(activeProductId);

  const activeTab = tab ?? 'overview';

  return (
    <FocusSheet open={!!activeProductId} onOpenChange={() => setActiveProductId(null)}>
      <FocusSheet.View className="w-[50%] md:w-[50%]">
        <FocusSheet.Header title={product?.name || 'Product Detail'} />
        <FocusSheet.Content className="flex flex-auto overflow-hidden flex-row min-h-0">
          <FocusSheet.SideBar>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupContent className="mt-2">
                  <Sidebar.Menu>
                    {TABS.map((t) => (
                      <Sidebar.MenuItem key={t}>
                        <Sidebar.MenuButton
                          isActive={activeTab === t}
                          onClick={() => setTab(t)}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    ))}
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
            </Sidebar.Content>
          </FocusSheet.SideBar>

          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <Tabs value={activeTab} onValueChange={setTab} className="flex flex-col flex-1 min-h-0">
              <Tabs.Content value="overview" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                <ScrollArea className="flex-1 min-h-0">
                  {loading && <div className="p-4"><Spinner /></div>}
                  {!loading && product && <ProductInfo product={product} />}
                  {!loading && !product && <div className="p-4">Product not found</div>}
                </ScrollArea>
              </Tabs.Content>

              <Tabs.Content value="activity" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                <ScrollArea className="flex-1 min-h-0">
                  <div className="flex flex-col mb-12">
                    {!!product?._id && (
                      <ActivityLogs
                        targetId={product._id}
                        showInternalNotes={false}
                      />
                    )}
                  </div>
                </ScrollArea>
              </Tabs.Content>
            </Tabs>

            <Sheet.Footer className="flex-none border-t">
              <Sheet.Close asChild>
                <Button variant="secondary" className="bg-border">
                  Close
                </Button>
              </Sheet.Close>
            </Sheet.Footer>
          </div>
        </FocusSheet.Content>
      </FocusSheet.View>
    </FocusSheet>
  );
};

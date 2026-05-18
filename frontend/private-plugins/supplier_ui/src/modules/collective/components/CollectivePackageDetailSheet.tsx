import { IconPackage, IconPackageOff } from '@tabler/icons-react';
import {
  Button,
  InfoCard,
  Input,
  ScrollArea,
  Select,
  Sheet,
  Spinner,
  Textarea,
  toast,
  useQueryState,
} from 'erxes-ui';
import { useMemo } from 'react';
import { useCollectivePackageDetail } from '../hooks/useCollectivePackageDetail';
import { ICollectivePackage } from '../hooks/useCollectivePackages';
import { useEditCollectivePackageStatus } from '../hooks/useEditCollectivePackageStatus';
import { IPoscProduct, usePoscProducts } from '../hooks/usePoscProducts';
import { usePosclientConfigs } from '../hooks/usePosclientConfigs';

const PACKAGE_STATUSES = ['draft', 'active', 'archived'] as const;

const formatNumber = (value?: number | null) =>
  value == null
    ? '—'
    : new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
        value,
      );

const ReadOnlyLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="font-medium text-sm">{children}</label>
);

const PackageProducts = ({ pkg }: { pkg: ICollectivePackage }) => {
  const productIds = pkg.productIds || [];
  const { products, loading } = usePoscProducts({
    posToken: pkg.posToken,
    perPage: Math.max(productIds.length, 50),
  });

  const productById = useMemo(() => {
    const map = new Map<string, IPoscProduct>();
    for (const p of products) map.set(p._id, p);
    return map;
  }, [products]);

  if (loading && !products.length) {
    return (
      <div className="flex justify-center items-center gap-2 py-12 text-muted-foreground text-sm">
        <Spinner /> Loading products…
      </div>
    );
  }

  if (!productIds.length) {
    return (
      <div className="flex flex-col justify-center items-center gap-2 py-12 text-muted-foreground text-sm text-center">
        <IconPackageOff className="opacity-60 size-6" />
        <span>No products in this package.</span>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {productIds.map((id) => {
        const product = productById.get(id);
        return (
          <li key={id} className="relative flex items-center gap-3 px-4 py-2.5">
            <span className="flex-auto min-w-0 font-medium text-sm truncate">
              {product?.name || product?.code || id}
            </span>
            {product?.code ? (
              <span className="font-mono text-muted-foreground text-xs truncate shrink-0">
                {product.code}
              </span>
            ) : null}
            <span className="font-medium tabular-nums text-sm shrink-0">
              {formatNumber(product?.unitPrice)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

const PackageDetailBody = ({ pkg }: { pkg: ICollectivePackage }) => {
  const { configs } = usePosclientConfigs();
  const posName = useMemo(() => {
    const match = configs.find((c) => c.token === pkg.posToken);
    return match?.name || pkg.posToken;
  }, [configs, pkg.posToken]);

  const { editStatus, loading: savingStatus } = useEditCollectivePackageStatus();

  const handleStatusChange = async (nextStatus: string) => {
    if (!nextStatus || nextStatus === (pkg.status || 'draft')) return;

    try {
      await editStatus({ variables: { _id: pkg._id, status: nextStatus } });
      toast({ variant: 'success', title: 'Status updated' });
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to update status',
        description: e?.message,
      });
    }
  };

  return (
    <Sheet.Content className="flex flex-auto p-0 overflow-hidden">
      {/* Left: read-only fields */}
      <ScrollArea className="border-r w-2/5 h-full shrink-0">
        <div className="flex flex-col gap-4 p-5">
          <InfoCard title="Basic information">
            <InfoCard.Content>
              <div className="gap-4 grid grid-cols-2">
                <div className="flex flex-col gap-2">
                  <ReadOnlyLabel>Name</ReadOnlyLabel>
                  <Input value={pkg.name || ''} readOnly />
                </div>

                <div className="flex flex-col gap-2">
                  <ReadOnlyLabel>Status</ReadOnlyLabel>
                  <Select
                    value={pkg.status || 'draft'}
                    disabled={savingStatus}
                    onValueChange={handleStatusChange}
                  >
                    <Select.Trigger className="h-8">
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      {PACKAGE_STATUSES.map((s) => (
                        <Select.Item key={s} value={s}>
                          {s}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 col-span-2">
                  <ReadOnlyLabel>Description</ReadOnlyLabel>
                  <Textarea
                    className="min-h-20"
                    rows={4}
                    value={pkg.description || ''}
                    readOnly
                  />
                </div>
              </div>
            </InfoCard.Content>
          </InfoCard>

          <InfoCard title="Pricing">
            <InfoCard.Content>
              <div className="gap-4 grid grid-cols-2">
                <div className="flex flex-col gap-2">
                  <ReadOnlyLabel>POS</ReadOnlyLabel>
                  <Input value={posName || ''} readOnly />
                </div>

                <div className="flex flex-col gap-2">
                  <ReadOnlyLabel>Price</ReadOnlyLabel>
                  <Input value={formatNumber(pkg.price)} readOnly />
                </div>
              </div>
            </InfoCard.Content>
          </InfoCard>
        </div>
      </ScrollArea>

      {/* Right: products */}
      <ScrollArea className="flex-auto bg-muted/20 h-full">
        <div className="p-5">
          <InfoCard title="Products">
            <InfoCard.Content className="p-0">
              <PackageProducts pkg={pkg} />
            </InfoCard.Content>
          </InfoCard>
        </div>
      </ScrollArea>
    </Sheet.Content>
  );
};

export const CollectivePackageDetailSheet = () => {
  const [activePackageId, setActivePackageId] =
    useQueryState<string>('activePackageId');
  const { package: pkg, loading } = useCollectivePackageDetail(activePackageId);

  return (
    <Sheet
      open={!!activePackageId}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setActivePackageId(null);
      }}
    >
      <Sheet.View className="p-0 sm:max-w-5xl">
        <div className="flex flex-col flex-auto overflow-hidden">
          <Sheet.Header className="flex gap-2">
            <IconPackage />
            <Sheet.Title>{pkg?.name || 'Package detail'}</Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>

          {loading && !pkg ? (
            <div className="flex flex-auto justify-center items-center">
              <Spinner />
            </div>
          ) : pkg ? (
            <PackageDetailBody pkg={pkg} />
          ) : (
            <div className="flex flex-auto justify-center items-center p-6 text-muted-foreground text-sm">
              Package not found
            </div>
          )}

          <Sheet.Footer className="flex-none">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActivePackageId(null)}
            >
              Close
            </Button>
          </Sheet.Footer>
        </div>
      </Sheet.View>
    </Sheet>
  );
};

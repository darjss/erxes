import { createContext, useContext, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Combobox, Command, GQL_CURSOR_PARAM_DEFS, GQL_CURSOR_PARAMS, ICursorListResponse, cn } from 'erxes-ui';
import { useDebounce } from 'use-debounce';

// ── types ────────────────────────────────────────────────────────────────────

interface IProduct {
  _id: string;
  name: string;
  code: string;
  unitPrice: number;
  uom: string;
}

// ── GQL ──────────────────────────────────────────────────────────────────────

const GET_PRODUCTS = gql`
  query SupplierSelectProduct($searchValue: String ${GQL_CURSOR_PARAM_DEFS}) {
    productsMain(searchValue: $searchValue ${GQL_CURSOR_PARAMS}) {
      list { _id name code unitPrice uom }
      totalCount
      pageInfo { endCursor hasNextPage }
    }
  }
`;

// ── context ───────────────────────────────────────────────────────────────────

interface ICtx {
  selectedIds: string[];
  onSelect: (product: IProduct) => void;
  products: IProduct[];
  getProduct: (id: string) => IProduct | undefined;
}

const Ctx = createContext<ICtx | null>(null);
const useCtx = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('must be inside SelectProductProvider');
  return ctx;
};

export { useCtx as useSelectProduct };
export type { IProduct };

// ── provider ──────────────────────────────────────────────────────────────────

interface ProviderProps {
  children: React.ReactNode;
  value?: string[];
  onValueChange?: (ids: string[]) => void;
  onProductSelect?: (product: IProduct, selected: boolean) => void;
}

export const SelectProductProvider = ({ children, value = [], onValueChange, onProductSelect }: ProviderProps) => {
  const [cache, setCache] = useState<IProduct[]>([]);

  const onSelect = (product: IProduct) => {
    setCache((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      return exists ? prev : [...prev, product];
    });
    const isSelected = value.includes(product._id);
    const next = isSelected
      ? value.filter((id) => id !== product._id)
      : [...value, product._id];
    onValueChange?.(next);
    onProductSelect?.(product, !isSelected);
  };

  const getProduct = (id: string) => cache.find((p) => p._id === id);

  return (
    <Ctx.Provider value={{ selectedIds: value, onSelect, products: cache, getProduct }}>
      {children}
    </Ctx.Provider>
  );
};

// ── content (search list) ─────────────────────────────────────────────────────

export const SelectProductContent = ({ className }: { className?: string }) => {
  const { selectedIds, products: selected, onSelect } = useCtx();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);

  const { data, loading, error, fetchMore } = useQuery<ICursorListResponse<IProduct>>(
    GET_PRODUCTS,
    { variables: { searchValue: debouncedSearch, limit: 30 } },
  );

  const { list = [], totalCount = 0, pageInfo } = data?.productsMain || {};

  const handleFetchMore = () => {
    if (!pageInfo?.hasNextPage) return;
    fetchMore({
      variables: { searchValue: debouncedSearch, cursor: pageInfo.endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          productsMain: {
            ...fetchMoreResult.productsMain,
            list: [...(prev.productsMain?.list || []), ...fetchMoreResult.productsMain.list],
          },
        };
      },
    });
  };

  const selectedProducts = selected.filter((p) => selectedIds.includes(p._id));

  return (
    <Command shouldFilter={false} className={cn('flex flex-col flex-1', className)}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        focusOnMount
      />
      <Command.List className="flex-1 overflow-y-auto max-h-full">
        {selectedProducts.length > 0 && (
          <>
            {selectedProducts.map((p) => (
              <ProductItem key={p._id} product={p} selectedIds={selectedIds} onSelect={onSelect} />
            ))}
            <Command.Separator className="my-1" />
          </>
        )}
        <Combobox.Empty loading={loading} error={error} />
        {!loading &&
          list
            .filter((p) => !selectedIds.includes(p._id))
            .map((p) => (
              <ProductItem key={p._id} product={p} selectedIds={selectedIds} onSelect={onSelect} />
            ))}
        {!loading && (
          <Combobox.FetchMore
            fetchMore={handleFetchMore}
            currentLength={list.length}
            totalCount={totalCount}
          />
        )}
      </Command.List>
    </Command>
  );
};

const ProductItem = ({
  product,
  selectedIds,
  onSelect,
}: {
  product: IProduct;
  selectedIds: string[];
  onSelect: (p: IProduct) => void;
}) => (
  <Command.Item value={product._id} onSelect={() => onSelect(product)}>
    <span className="flex-1 truncate">
      {product.name}
      {product.code && (
        <span className="ml-2 text-xs text-muted-foreground">{product.code}</span>
      )}
    </span>
    <Combobox.Check checked={selectedIds.includes(product._id)} />
  </Command.Item>
);

// ── value display ─────────────────────────────────────────────────────────────

export const SelectProductValue = ({ placeholder }: { placeholder?: string }) => {
  const { selectedIds, products } = useCtx();
  if (!selectedIds.length) return <span className="text-muted-foreground">{placeholder ?? 'Select products'}</span>;
  const names = selectedIds.map((id) => products.find((p) => p._id === id)?.name ?? id);
  return <span className="truncate">{names.join(', ')}</span>;
};

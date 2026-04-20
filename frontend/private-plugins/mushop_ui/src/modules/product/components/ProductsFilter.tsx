import {
  IconProgress,
  IconSearch,
  IconTruck,
} from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';
import { SelectSupplier } from '@/supplier/components/select/SelectSupplier';
import { SelectProductStatus } from './SelectProductStatus';

const ProductsFilterPopover = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    status: string;
    supplierId: string;
  }>(['searchValue', 'status', 'supplierId']);

  const hasFilters = Object.values(queries || {}).some((v) => v !== null);

  return (
    <>
      <Filter.Popover>
        <Filter.Trigger isFiltered={hasFilters} />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Filter.CommandInput
                placeholder="Filter"
                variant="secondary"
                className="bg-background"
              />
              <Command.List className="p-1">
                <Filter.Item value="searchValue" inDialog>
                  <IconSearch />
                  Search
                </Filter.Item>
                <Filter.Item value="status">
                  <IconProgress />
                  Status
                </Filter.Item>
                <Filter.Item value="supplierId">
                  <IconTruck />
                  Supplier
                </Filter.Item>
              </Command.List>
            </Command>
          </Filter.View>
          <SelectProductStatus.FilterView />
          <SelectSupplier.FilterView />
        </Combobox.Content>
      </Filter.Popover>
      <Filter.Dialog>
        <Filter.View filterKey="searchValue" inDialog>
          <Filter.DialogStringView filterKey="searchValue" />
        </Filter.View>
      </Filter.Dialog>
    </>
  );
};

export const ProductsFilter = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    supplierId: string;
  }>(['searchValue', 'supplierId']);

  return (
    <Filter id="products-filter">
      <Filter.Bar>
        <Filter.BarItem queryKey="searchValue">
          <Filter.BarName>
            <IconSearch />
            Search
          </Filter.BarName>
          <Filter.BarButton filterKey="searchValue" inDialog>
            {queries?.searchValue || ''}
          </Filter.BarButton>
        </Filter.BarItem>
        <Filter.BarItem queryKey="status">
          <Filter.BarName>
            <IconProgress />
            Status
          </Filter.BarName>
          <SelectProductStatus.FilterBar />
        </Filter.BarItem>
        <Filter.BarItem queryKey="supplierId">
          <Filter.BarName>
            <IconTruck />
            Supplier
          </Filter.BarName>
          <SelectSupplier.FilterBar />
        </Filter.BarItem>
        <ProductsFilterPopover />
      </Filter.Bar>
    </Filter>
  );
};

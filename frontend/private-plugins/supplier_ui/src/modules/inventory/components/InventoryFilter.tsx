import { IconAlertTriangle, IconProgress } from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';
import { SelectInventoryStatus } from './SelectInventoryStatus';
import { SelectLowStock } from './SelectLowStock';

const InventoryFilterPopover = () => {
  const [queries] = useMultiQueryState<{
    status: string;
    isBelowSafeRemainder: string;
  }>(['status', 'isBelowSafeRemainder']);

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
                <Filter.Item value="status">
                  <IconProgress />
                  Status
                </Filter.Item>
                <Filter.Item value="isBelowSafeRemainder">
                  <IconAlertTriangle />
                  Low stock
                </Filter.Item>
              </Command.List>
            </Command>
          </Filter.View>
          <SelectInventoryStatus.FilterView />
          <SelectLowStock.FilterView />
        </Combobox.Content>
      </Filter.Popover>
    </>
  );
};

export const InventoryFilter = () => {
  return (
    <Filter id="inventory-filter">
      <Filter.Bar>
        <Filter.BarItem queryKey="status">
          <Filter.BarName>
            <IconProgress />
            Status
          </Filter.BarName>
          <SelectInventoryStatus.FilterBar />
        </Filter.BarItem>
        <Filter.BarItem queryKey="isBelowSafeRemainder">
          <Filter.BarName>
            <IconAlertTriangle />
            Low stock
          </Filter.BarName>
          <SelectLowStock.FilterBar />
        </Filter.BarItem>
        <InventoryFilterPopover />
      </Filter.Bar>
    </Filter>
  );
};

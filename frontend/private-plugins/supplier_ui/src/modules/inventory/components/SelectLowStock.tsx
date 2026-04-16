import {
  Combobox,
  Command,
  Filter,
  Popover,
  PopoverScoped,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { useState } from 'react';

const FilterView = ({ queryKey }: { queryKey?: string }) => {
  const key = queryKey || 'isBelowSafeRemainder';
  const [value, setValue] = useQueryState<string>(key);
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={key}>
      <Command id="low-stock-command-menu">
        <Command.List>
          <Command.Item
            value="true"
            onSelect={() => {
              setValue(value === 'true' ? '' : 'true');
              resetFilterState();
            }}
          >
            Show only low stock
            <Combobox.Check checked={value === 'true'} />
          </Command.Item>
        </Command.List>
      </Command>
    </Filter.View>
  );
};

const FilterBar = ({ queryKey }: { queryKey?: string }) => {
  const key = queryKey || 'isBelowSafeRemainder';
  const [value, setValue] = useQueryState<string>(key);
  const [open, setOpen] = useState(false);

  return (
    <PopoverScoped open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Filter.BarButton filterKey={key}>
          {value === 'true' ? 'Yes' : (
            <span className="text-accent-foreground/80">Select…</span>
          )}
        </Filter.BarButton>
      </Popover.Trigger>
      <Combobox.Content>
        <Command id="low-stock-bar-command-menu">
          <Command.List>
            <Command.Item
              value="true"
              onSelect={() => {
                setValue(value === 'true' ? '' : 'true');
                setOpen(false);
              }}
            >
              Show only low stock
              <Combobox.Check checked={value === 'true'} />
            </Command.Item>
          </Command.List>
        </Command>
      </Combobox.Content>
    </PopoverScoped>
  );
};

export const SelectLowStock = {
  FilterView,
  FilterBar,
};

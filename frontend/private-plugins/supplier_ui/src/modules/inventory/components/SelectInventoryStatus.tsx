import {
  Combobox,
  Command,
  Filter,
  Popover,
  PopoverScoped,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import React, { useState } from 'react';

const INVENTORY_STATUS: Record<string, { text: string }> = {
  active: { text: 'Active' },
  inactive: { text: 'Inactive' },
  out_of_stock: { text: 'Out of stock' },
};

interface Ctx {
  value?: string;
  onValueChange: (value: string) => void;
}

const SelectInventoryStatusContext = React.createContext<Ctx | null>(null);

const useCtx = () => {
  const c = React.useContext(SelectInventoryStatusContext);
  if (!c) throw new Error('SelectInventoryStatus context missing');
  return c;
};

const Provider = ({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
}) => (
  <SelectInventoryStatusContext.Provider value={{ value, onValueChange }}>
    {children}
  </SelectInventoryStatusContext.Provider>
);

const Value = ({ placeholder }: { placeholder?: string }) => {
  const { value } = useCtx();
  if (!value)
    return (
      <span className="text-accent-foreground/80">
        {placeholder || 'Select status...'}
      </span>
    );
  return <>{INVENTORY_STATUS[value]?.text || value}</>;
};

const Item = ({ status, text }: { status: string; text: string }) => {
  const { value, onValueChange } = useCtx();
  return (
    <Command.Item
      value={status}
      onSelect={() => onValueChange(value === status ? '' : status)}
    >
      {text}
      <Combobox.Check checked={value === status} />
    </Command.Item>
  );
};

const Content = () => (
  <Command id="inventory-status-command-menu">
    <Command.Input placeholder="Select status" />
    <Command.List>
      <Command.Empty>No status found</Command.Empty>
      {Object.entries(INVENTORY_STATUS).map(([key, s]) => (
        <Item key={key} status={key} text={s.text} />
      ))}
    </Command.List>
  </Command>
);

const FilterView = ({ queryKey }: { queryKey?: string }) => {
  const [value, setValue] = useQueryState<string>(queryKey || 'status');
  const { resetFilterState } = useFilterContext();
  return (
    <Filter.View filterKey={queryKey || 'status'}>
      <Provider
        value={value as string}
        onValueChange={(v) => {
          setValue(v);
          resetFilterState();
        }}
      >
        <Content />
      </Provider>
    </Filter.View>
  );
};

const FilterBar = ({ queryKey }: { queryKey?: string }) => {
  const [value, setValue] = useQueryState<string>(queryKey || 'status');
  const [open, setOpen] = useState(false);
  return (
    <Provider
      value={value as string}
      onValueChange={(v) => {
        setValue(v);
        setOpen(false);
      }}
    >
      <PopoverScoped open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Filter.BarButton filterKey={queryKey || 'status'}>
            <Value />
          </Filter.BarButton>
        </Popover.Trigger>
        <Combobox.Content>
          <Content />
        </Combobox.Content>
      </PopoverScoped>
    </Provider>
  );
};

export const SelectInventoryStatus = {
  FilterView,
  FilterBar,
};

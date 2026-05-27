import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  cn,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { IconUser } from '@tabler/icons-react';
import { useQuery, gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const GET_CUSTOMERS_SIMPLE = gql`
  query ScoreCustomersSimple($searchValue: String, $limit: Int) {
    customers(searchValue: $searchValue, limit: $limit) {
      list {
        _id
        firstName
        middleName
        lastName
        primaryEmail
        primaryPhone
      }
    }
  }
`;

interface CustomerOption {
  value: string;
  label: string;
}

const getCustomerLabel = (
  c: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    primaryEmail?: string;
    primaryPhone?: string;
  },
  unnamed = 'Unnamed',
) => {
  const name = [c.firstName, c.middleName, c.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  return name || c.primaryEmail || c.primaryPhone || unnamed;
};

const useCustomerOptions = (searchValue?: string) => {
  const { t } = useTranslation('loyalty');
  const { data, loading } = useQuery(GET_CUSTOMERS_SIMPLE, {
    variables: { limit: 50, searchValue },
  });

  const options = useMemo<CustomerOption[]>(
    () =>
      (data?.customers?.list || []).map(
        (c: {
          _id: string;
          firstName?: string;
          middleName?: string;
          lastName?: string;
          primaryEmail?: string;
          primaryPhone?: string;
        }) => ({ value: c._id, label: getCustomerLabel(c, t('unnamed')) }),
      ),
    [data?.customers?.list, t],
  );

  return { options, loading };
};

interface SelectScoreCustomerContextType {
  value: string;
  onValueChange: (val: string) => void;
  options: CustomerOption[];
  loading: boolean;
  search: string;
  setSearch: (s: string) => void;
}

const SelectScoreCustomerContext =
  createContext<SelectScoreCustomerContextType | null>(null);

const useSelectScoreCustomerContext = () => {
  const ctx = useContext(SelectScoreCustomerContext);
  if (!ctx)
    throw new Error(
      'useSelectScoreCustomerContext must be used within SelectScoreCustomerProvider',
    );
  return ctx;
};

export const SelectScoreCustomerProvider = ({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
}) => {
  const [search, setSearch] = useState('');
  const { options, loading } = useCustomerOptions(search);

  const handleChange = useCallback(
    (val: string) => {
      if (!val) return;
      onValueChange(val);
    },
    [onValueChange],
  );

  const ctx = useMemo(
    () => ({
      value: value || '',
      onValueChange: handleChange,
      options,
      loading,
      search,
      setSearch,
    }),
    [value, handleChange, options, loading, search],
  );

  return (
    <SelectScoreCustomerContext.Provider value={ctx}>
      {children}
    </SelectScoreCustomerContext.Provider>
  );
};

const SelectScoreCustomerValue = ({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const { t } = useTranslation('loyalty');
  const { value, options } = useSelectScoreCustomerContext();
  const selected = options.find((o) => o.value === value);

  if (!selected) {
    return (
      <span className="text-accent-foreground/80">
        {placeholder || t('select-customer')}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <p className={cn('font-medium text-sm', className)}>{selected.label}</p>
    </div>
  );
};

const SelectScoreCustomerContent = () => {
  const { t } = useTranslation('loyalty');
  const { value, onValueChange, options, loading, search, setSearch } =
    useSelectScoreCustomerContext();

  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder={t('search-customers')}
      />
      <Command.Empty>
        {loading ? t('loading') : t('no-customers-found')}
      </Command.Empty>
      <Command.List>
        {options.map((opt) => (
          <Command.Item
            key={opt.value}
            value={opt.value}
            onSelect={() => onValueChange(opt.value)}
          >
            <span className="font-medium">{opt.label}</span>
            <Combobox.Check checked={value === opt.value} />
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectScoreCustomerFilterItem = () => {
  const { t } = useTranslation('loyalty');
  return (
    <Filter.Item value="scoreOwnerId">
      <IconUser />
      {t('customer')}
    </Filter.Item>
  );
};

export const SelectScoreCustomerFilterView = ({
  queryKey = 'scoreOwnerId',
}: {
  queryKey?: string;
}) => {
  const [value, setValue] = useQueryState<string>(queryKey);
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={queryKey}>
      <SelectScoreCustomerProvider
        value={value || ''}
        onValueChange={(val) => {
          setValue(val);
          resetFilterState();
        }}
      >
        <SelectScoreCustomerContent />
      </SelectScoreCustomerProvider>
    </Filter.View>
  );
};

export const SelectScoreCustomerFilterBar = () => {
  const { t } = useTranslation('loyalty');
  const [value, setValue] = useQueryState<string>('scoreOwnerId');
  const [open, setOpen] = useState(false);

  return (
    <Filter.BarItem queryKey="scoreOwnerId">
      <Filter.BarName>
        <IconUser />
        {t('customer')}
      </Filter.BarName>
      <SelectScoreCustomerProvider
        value={value || ''}
        onValueChange={(val) => {
          setValue(val || null);
          setOpen(false);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey="scoreOwnerId">
              <SelectScoreCustomerValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectScoreCustomerContent />
          </Combobox.Content>
        </Popover>
      </SelectScoreCustomerProvider>
    </Filter.BarItem>
  );
};

export const SelectScoreCustomerFormItem = ({
  value,
  onValueChange,
  placeholder,
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectScoreCustomerProvider
      value={value}
      onValueChange={(val) => {
        onValueChange(val);
        setOpen(false);
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full shadow-xs', className)}>
            <SelectScoreCustomerValue placeholder={placeholder} />
          </Combobox.Trigger>
        </Form.Control>
        <Combobox.Content>
          <SelectScoreCustomerContent />
        </Combobox.Content>
      </Popover>
    </SelectScoreCustomerProvider>
  );
};

const SelectScoreCustomerRoot = ({
  value,
  onValueChange,
  placeholder,
  className,
}: {
  value: string;
  onValueChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectScoreCustomerProvider
      value={value}
      onValueChange={(val) => {
        onValueChange?.(val);
        setOpen(false);
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.Trigger className={cn('shadow-xs', className)}>
          <SelectScoreCustomerValue placeholder={placeholder} />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectScoreCustomerContent />
        </Combobox.Content>
      </Popover>
    </SelectScoreCustomerProvider>
  );
};

export const SelectScoreCustomer = Object.assign(SelectScoreCustomerRoot, {
  Provider: SelectScoreCustomerProvider,
  Value: SelectScoreCustomerValue,
  Content: SelectScoreCustomerContent,
  FilterItem: SelectScoreCustomerFilterItem,
  FilterView: SelectScoreCustomerFilterView,
  FilterBar: SelectScoreCustomerFilterBar,
  FormItem: SelectScoreCustomerFormItem,
});

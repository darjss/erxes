import { Input } from 'erxes-ui';
import { AdminListingFilter } from '../types';

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Sold', value: 'sold' },
] as const;

type Props = {
  filter: AdminListingFilter;
  onFilterChange: (filter: AdminListingFilter) => void;
};

export const AdminListingFilterBar = ({ filter, onFilterChange }: Props) => {
  const handleStatusChange = (status: string) =>
    onFilterChange({ ...filter, status: status || undefined });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onFilterChange({ ...filter, searchValue: e.target.value || undefined });

  return (
    <div className="flex items-center gap-4 px-8 py-2 w-full">
      <div className="flex items-center gap-1 bg-accent rounded-lg p-1">
        {STATUS_TABS.map(({ label, value }) => {
          const isActive = (filter.status ?? '') === value;
          return (
            <button
              key={value}
              onClick={() => handleStatusChange(value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors font-medium ${
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-accent-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <Input
        placeholder="Search listings..."
        value={filter.searchValue ?? ''}
        onChange={handleSearchChange}
        className="max-w-xs h-8"
      />
    </div>
  );
};

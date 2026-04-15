import { Input } from 'erxes-ui';
import { AgenciesFilterVars } from '../hooks/useAgencies';

type Props = {
  filter: AgenciesFilterVars;
  onFilterChange: (filter: AgenciesFilterVars) => void;
};

export const AgenciesFilter = ({ filter, onFilterChange }: Props) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, searchValue: e.target.value || undefined });
  };

  return (
    <div className="flex items-center gap-4 px-8 py-2 w-full">
      <Input
        placeholder="Search agencies..."
        value={filter.searchValue ?? ''}
        onChange={handleSearchChange}
        className="max-w-xs h-8"
      />
    </div>
  );
};

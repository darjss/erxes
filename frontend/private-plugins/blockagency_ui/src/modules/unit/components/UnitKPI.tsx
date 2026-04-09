import { useGetUnits } from '../hooks/useGetUnits';

export const UnitKPI = () => {
  const { totalCount, loading } = useGetUnits();

  return (
    <div className="flex items-center gap-6 px-4 py-3">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Total units</span>
        <span className="text-lg font-semibold">
          {loading ? '—' : totalCount}
        </span>
      </div>
    </div>
  );
};

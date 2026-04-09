import { Label, RecordTable } from 'erxes-ui';
import { unitColumns } from './unitColumns';
import { useGetUnits } from '../hooks/useGetUnits';

const PER_PAGE = 20;

export const UnitRecordTable = () => {
  const { units, loading, totalCount } = useGetUnits({
    perPage: PER_PAGE,
  } as any);

  const RecordMain = () => {
    if (loading) {
      return <RecordTable.RowSkeleton rows={20} />;
    }
    if (!totalCount) {
      return (
        <tr className="h-[40vh]">
          <td colSpan={5} className="py-10 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Label>No assigned units</Label>
            </div>
          </td>
        </tr>
      );
    }
    return <RecordTable.RowList />;
  };

  return (
    <RecordTable.Provider
      columns={unitColumns}
      data={units}
      stickyColumns={['blockUnitId']}
      className="m-3"
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          <RecordMain />
        </RecordTable.Body>
      </RecordTable>
    </RecordTable.Provider>
  );
};

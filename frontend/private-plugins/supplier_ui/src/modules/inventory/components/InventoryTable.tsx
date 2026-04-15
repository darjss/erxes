import { RecordTable } from 'erxes-ui';
import { useInventoryItems } from '../hooks/useInventoryItems';
import { inventoryColumns } from './InventoryColumns';

export const InventoryTable = ({ supplierId }: { supplierId?: string }) => {
  const { items, loading } = useInventoryItems(supplierId);

  return (
    <RecordTable.Provider
      columns={inventoryColumns}
      data={items}
      className="m-3"
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {loading && <RecordTable.RowSkeleton rows={10} />}
          <RecordTable.RowList />
        </RecordTable.Body>
      </RecordTable>
    </RecordTable.Provider>
  );
};

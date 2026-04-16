import { RecordTable } from 'erxes-ui';
import { useMushopProducts } from '../hooks/useMushopProducts';
import { productColumns } from './ProductColumns';

export const ProductsTable = () => {
  const { products, loading } = useMushopProducts();

  return (
    <RecordTable.Provider
      columns={productColumns}
      data={products || []}
      className="m-3"
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {loading && <RecordTable.RowSkeleton rows={20} />}
          <RecordTable.RowList />
        </RecordTable.Body>
      </RecordTable>
    </RecordTable.Provider>
  );
};

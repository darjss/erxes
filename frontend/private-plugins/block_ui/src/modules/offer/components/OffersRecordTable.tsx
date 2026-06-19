import { offersColumns } from '@/offer/components/OffersColumn';
import { useOffers } from '@/offer/hooks/useOffers';
import { RecordTable } from 'erxes-ui';

export const OffersRecordTable = ({ unitId }: { unitId?: string }) => {
  const { offers, loading } = useOffers(unitId);

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <RecordTable.Provider
        columns={offersColumns()}
        data={offers || (loading ? [{}] : [])}
        className="m-3 h-full"
        stickyColumns={['checkbox', 'number']}
        tableId="offers_record_table"
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            {loading && <RecordTable.RowSkeleton rows={10} />}
            <RecordTable.RowList />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Provider>
    </div>
  );
};

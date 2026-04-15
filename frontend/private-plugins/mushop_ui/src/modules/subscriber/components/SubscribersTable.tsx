import { RecordTable } from 'erxes-ui';
import { useSubscribers } from '../hooks/useSubscribers';
import { subscribersColumns } from './SubscribersColumns';

const SUBSCRIBERS_CURSOR_SESSION_KEY = 'mushop-subscribers-cursor';

export const SubscribersTable = () => {
  const { subscribers, loading, pageInfo, handleFetchMore } = useSubscribers();
  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  return (
    <RecordTable.Provider
      columns={subscribersColumns}
      data={subscribers || []}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        dataLength={subscribers?.length}
        sessionKey={SUBSCRIBERS_CURSOR_SESSION_KEY}
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
            />
            {loading && <RecordTable.RowSkeleton rows={20} />}
            <RecordTable.RowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
    </RecordTable.Provider>
  );
};

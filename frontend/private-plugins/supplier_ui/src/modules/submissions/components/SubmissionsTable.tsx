import { RecordTable } from 'erxes-ui';
import { useSubmissions } from '../hooks/useSubmissions';
import { submissionColumns } from './submissionColumns';
import { SubmissionDetailSheet } from './SubmissionDetailSheet';

const CURSOR_SESSION_KEY = 'supplier-submissions-cursor';

export const SubmissionsTable = () => {
  const { submissions, loading, pageInfo, handleFetchMore } = useSubmissions();
  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  return (
    <>
      <RecordTable.Provider
        columns={submissionColumns}
        data={submissions || []}
        className="m-3"
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          dataLength={submissions?.length}
          sessionKey={CURSOR_SESSION_KEY}
        >
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.CursorBackwardSkeleton handleFetchMore={handleFetchMore} />
              {loading && <RecordTable.RowSkeleton rows={20} />}
              <RecordTable.RowList />
              <RecordTable.CursorForwardSkeleton handleFetchMore={handleFetchMore} />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.CursorProvider>
      </RecordTable.Provider>

      <SubmissionDetailSheet />
    </>
  );
};

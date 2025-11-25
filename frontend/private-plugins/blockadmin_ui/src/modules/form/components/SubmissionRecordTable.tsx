import { SUBMISSIONS_CURSOR_SESSION_KEY } from '@/form/constants/submissionCursorSessionKey';
import { useSubmissions } from '@/form/hooks/useSubmissions';
import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';
import { BLOCK_FORMS } from '../constants/blockForms';

export const SubmissionRecordTable = () => {
  const { submissions, handleFetchMore, loading, pageInfo } = useSubmissions();

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'lead',
      header: 'Lead',
      cell: ({ cell }) => {
        const lead = cell.getValue() as any;

        if (!lead) {
          return (
            <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
              Unknown
            </RecordTableInlineCell>
          );
        }

        return (
          <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
            <Link to={`/contacts/${lead.state}s?contactId=${lead._id}`}>
              {lead.firstName ||
                lead.lastName ||
                lead.primaryPhone ||
                lead.primaryEmail ||
                'Unknown'}
            </Link>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'form',
      header: 'Form',
      cell: ({ cell }) => {
        const formId = cell.getValue() as number;

        return (
          <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
            {BLOCK_FORMS[formId].title}
          </RecordTableInlineCell>
        );
      },
    },
    // ANSWER 1
    {
      accessorKey: 'answer1',
      header: 'Answer 1',
    },

    // ANSWER 2
    {
      accessorKey: 'answer2',
      header: 'Answer 2',
    },

    // ANSWER 3
    {
      accessorKey: 'answer3',
      header: 'Answer 3',
    },

    // ANSWER 4
    {
      accessorKey: 'answer4',
      header: 'Answer 4',
    },
    {
      accessorKey: 'submittedAt',
      header: 'Submitted At',
      cell: ({ cell }) => {
        return (
          <RelativeDateDisplay value={cell.getValue() as string} asChild>
            <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
              <RelativeDateDisplay.Value value={cell.getValue() as string} />
            </RecordTableInlineCell>
          </RelativeDateDisplay>
        );
      },
    },
  ];

  return (
    <RecordTable.Provider
      columns={columns}
      data={submissions || []}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        dataLength={submissions?.length}
        sessionKey={SUBMISSIONS_CURSOR_SESSION_KEY}
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
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

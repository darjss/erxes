import { Row } from '@tanstack/table-core';
import { Button, CommandBar, RecordTable, Separator } from 'erxes-ui';
import { IconRefresh } from '@tabler/icons-react';
import { ISubmission } from '../types';
import { SubmitProductSheet } from './SubmitProductSheet';

export const SubmissionsCommandBar = () => {
  const { table } = RecordTable.useRecordTable();
  const selectedRows: Row<ISubmission>[] = table.getFilteredSelectedRowModel().rows;

  const rejectedRows = selectedRows.filter((r) => r.original.status === 'rejected');
  const allRejected = selectedRows.length > 0 && rejectedRows.length === selectedRows.length;

  return (
    <CommandBar open={selectedRows.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value>{selectedRows.length} selected</CommandBar.Value>
        {allRejected && (
          <>
            <Separator.Inline />
            <SubmitProductSheet
              defaultProductId={rejectedRows.length === 1 ? rejectedRows[0].original.productId : undefined}
              trigger={
                <Button variant="outline" size="sm" className="shadow-none border-dashed border">
                  <IconRefresh className="size-4 mr-1" />
                  {rejectedRows.length === 1 ? 'Resubmit' : `Resubmit ${rejectedRows.length}`}
                </Button>
              }
              onCompleted={() => table.resetRowSelection()}
            />
          </>
        )}
      </CommandBar.Bar>
    </CommandBar>
  );
};

import { ColumnDef } from '@tanstack/react-table';
import {
  RecordTable,
  TextOverflowTooltip,
  RecordTableInlineCell,
} from 'erxes-ui';
import { ICVClient } from '../clientsTypes';
import { IconLabelFilled } from '@tabler/icons-react';

export const clientsColumns: ColumnDef<ICVClient>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
  },
];

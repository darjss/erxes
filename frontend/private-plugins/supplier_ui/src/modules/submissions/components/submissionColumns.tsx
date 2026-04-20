import {
  Badge,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
  TextOverflowTooltip,
} from 'erxes-ui';
import { ColumnDef } from '@tanstack/react-table';
import { useSetAtom } from 'jotai';
import { ISubmission } from '../types';
import { ProductsInline } from 'ui-modules';
import { submissionDetailSheetState } from '../states/submissionDetailSheetState';

export const statusVariant = (status?: string) => {
  if (status === 'approved') return 'success' as const;
  if (status === 'rejected') return 'destructive' as const;
  if (status === 'resubmitted') return 'warning' as const;
  return 'secondary' as const;
};

const ProductCell = ({ submission }: { submission: ISubmission }) => {
  const setActive = useSetAtom(submissionDetailSheetState);
  return (
    <RecordTableInlineCell onClick={() => setActive(submission)}>
      <ProductsInline
        productIds={[submission.productId]}
        placeholder="Unknown product"
      />
    </RecordTableInlineCell>
  );
};

export const submissionColumns: ColumnDef<ISubmission>[] = [
  RecordTable.checkboxColumn as ColumnDef<ISubmission>,
  {
    id: 'product',
    header: 'Product',
    cell: ({ row }) => <ProductCell submission={row.original} />,
    size: 220,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <RecordTableInlineCell>
        <Badge variant={statusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      </RecordTableInlineCell>
    ),
    size: 110,
  },
  {
    id: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.original.offering?.price;

      return (
        <RecordTableInlineCell>
          {price != null ? `₮${price.toLocaleString()}` : '-'}
        </RecordTableInlineCell>
      );
    },
    size: 110,
  },
  {
    id: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.original.offering?.stock;

      return (
        <RecordTableInlineCell>
          {stock != null ? stock : '-'}
        </RecordTableInlineCell>
      );
    },
    size: 80,
  },
  {
    id: 'groupBuy',
    header: 'Group buy',
    cell: ({ row }) => {
      const { groupBuyMinCount, groupBuyDiscount } =
        row.original.offering || {};

      if (!groupBuyMinCount && !groupBuyDiscount)
        return <RecordTableInlineCell>—</RecordTableInlineCell>;

      return (
        <RecordTableInlineCell>
          {groupBuyMinCount ?? '—'} · {groupBuyDiscount ?? '—'}%
        </RecordTableInlineCell>
      );
    },
    size: 110,
  },
  {
    id: 'submittedAt',
    header: 'Submitted',
    cell: ({ row }) => (
      <RecordTableInlineCell>
        {row.original.submittedAt ? (
          <RelativeDateDisplay value={row.original.submittedAt} />
        ) : (
          '-'
        )}
      </RecordTableInlineCell>
    ),
    size: 130,
  },
  {
    id: 'decidedAt',
    header: 'Decided',
    cell: ({ row }) => (
      <RecordTableInlineCell>
        {row.original.decidedAt ? (
          <RelativeDateDisplay value={row.original.decidedAt} />
        ) : (
          '-'
        )}
      </RecordTableInlineCell>
    ),
    size: 130,
  },
  {
    id: 'note',
    header: 'Note',
    cell: ({ row }) => (
      <RecordTableInlineCell>
        {row.original.note ? (
          <TextOverflowTooltip value={row.original.note} />
        ) : (
          '-'
        )}
      </RecordTableInlineCell>
    ),
    size: 180,
  },
];

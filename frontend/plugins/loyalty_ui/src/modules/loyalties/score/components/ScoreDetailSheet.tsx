import {
  IconCalendar,
  IconChartBar,
  IconCoins,
  IconCurrencyDollar,
  IconHash,
  IconNote,
  IconRefresh,
  IconShoppingCart,
  IconTag,
  IconTrophy,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  fixNum,
  RecordTable,
  RecordTableInlineCell,
  Sheet,
  TextOverflowTooltip,
} from 'erxes-ui';
import { useTranslation } from 'react-i18next';
import { IScoreLog, IScoreLogItem } from '../types/score';

interface ScoreDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: IScoreLog | null;
}

const getOwnerName = (record: IScoreLog | null): string => {
  const owner = record?.owner;
  const ownerType = record?.ownerType;
  if (!owner) return '—';
  if (ownerType === 'user') {
    return (
      owner.details?.fullName ||
      [owner.details?.firstName, owner.details?.lastName]
        .filter(Boolean)
        .join(' ') ||
      '—'
    );
  }
  if (ownerType === 'company') return owner.primaryName || '—';
  return (
    [owner.firstName, owner.middleName, owner.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() || '—'
  );
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-CA');
};

const formatScore = (value?: number) =>
  fixNum(value, 4).toLocaleString()

const logColumns: ColumnDef<IScoreLogItem>[] = [
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconCalendar} label={t('date')} />;
    },
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={formatDate(cell.getValue() as string)} />
      </RecordTableInlineCell>
    ),
    size: 120,
  },
  {
    id: '_id',
    accessorKey: '_id',
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconHash} label={t('transaction-id')} />;
    },
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={(cell.getValue() as string) || ''} />
      </RecordTableInlineCell>
    ),
    size: 200,
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconTag} label={t('type')} />;
    },
    cell: ({ cell }) => {
      const action = cell.getValue() as string | undefined;
      if (!action)
        return (
          <RecordTableInlineCell>
            <span className="text-muted-foreground"></span>
          </RecordTableInlineCell>
        );
      let variant = 'secondary';
      if (action === 'add') variant = 'success';
      else if (action === 'subtract') variant = 'destructive';
      else if (action === 'set') variant = 'outline';
      return (
        <RecordTableInlineCell>
          <Badge variant={variant as any}>{action}</Badge>
        </RecordTableInlineCell>
      );
    },
    size: 70,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconCurrencyDollar} label={t('amount')} />;
    },
    cell: ({ cell }) => {
      const val = cell.getValue() as number | undefined;
      return (
        <RecordTableInlineCell className="text-right">
          <TextOverflowTooltip
            value={val == null ? '' : val.toLocaleString()}
          />
        </RecordTableInlineCell>
      );
    },
    size: 100,
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconShoppingCart} label={t('quantity')} />;
    },
    cell: ({ cell }) => {
      const val = cell.getValue() as number | undefined;
      return (
        <RecordTableInlineCell className="text-right">
          <TextOverflowTooltip value={val == null ? '' : String(val)} />
        </RecordTableInlineCell>
      );
    },
    size: 100,
  },
  {
    id: 'pointsEarned',
    accessorFn: (row) => (row.action === 'add' ? row.change : undefined),
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconCoins} label={t('points-earned')} />;
    },
    cell: ({ cell }) => {
      const val = cell.getValue() as number | undefined;
      return (
        <RecordTableInlineCell className="text-right font-semibold text-green-600">
          <TextOverflowTooltip value={formatScore(val)} />
        </RecordTableInlineCell>
      );
    },
    size: 120,
  },
  {
    id: 'pointsSpent',
    accessorFn: (row) => (row.action === 'subtract' ? row.change : undefined),
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconChartBar} label={t('points-spent')} />;
    },
    cell: ({ cell }) => {
      const val = cell.getValue() as number | undefined;
      return (
        <RecordTableInlineCell className="text-right font-semibold text-red-500">
          <TextOverflowTooltip value={formatScore(val)} />
        </RecordTableInlineCell>
      );
    },
    size: 120,
  },
  {
    id: 'pointsRefunded',
    accessorFn: (row) => (row.action === 'refund' ? row.change : undefined),
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconRefresh} label={t('points-refunded')} />;
    },
    cell: ({ cell }) => {
      const val = cell.getValue() as number | undefined;
      return (
        <RecordTableInlineCell className="text-right font-semibold text-blue-500">
          <TextOverflowTooltip value={formatScore(val)} />
        </RecordTableInlineCell>
      );
    },
    size: 150,
  },
  {
    id: 'pointsSet',
    accessorFn: (row) => (row.action === 'set' ? row.change : undefined),
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconCoins} label={t('score-set')} />;
    },
    cell: ({ cell }) => {
      const val = cell.getValue() as number | undefined;
      return (
        <RecordTableInlineCell className="text-right font-semibold text-violet-600">
          <TextOverflowTooltip value={formatScore(val)} />
        </RecordTableInlineCell>
      );
    },
    size: 120,
  },
  {
    id: 'campaign',
    accessorFn: (row) => row.campaign?.title,
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconTrophy} label={t('campaign')} />;
    },
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableInlineCell>
    ),
    size: 140,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => {
      const { t } = useTranslation('loyalty');
      return <RecordTable.InlineHead icon={IconNote} label={t('description')} />;
    },
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={(cell.getValue() as string) || ''} />
      </RecordTableInlineCell>
    ),
    size: 160,
  },
];

export const ScoreDetailSheet = ({
  open,
  onOpenChange,
  record,
}: ScoreDetailSheetProps) => {
  const { t } = useTranslation('loyalty');
  const ownerName = getOwnerName(record);
  const logs = record?.logs || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal>
      <Sheet.View side="bottom" className="h-[70vh] p-0 flex flex-col">
        <Sheet.Header className="border-b px-6 py-4 gap-3 shrink-0">
          <div>
            <Sheet.Title>{ownerName}</Sheet.Title>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              {record?.ownerType || ''} · {t('total-score')}:{' '}
              <span className="font-semibold text-foreground">
                {formatScore(record?.totalScore)}
              </span>
            </p>
          </div>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Content className="flex-1 min-h-0 p-4 overflow-auto">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
              {t('no-log-records-found')}
            </div>
          ) : (
            <div className="rounded-md overflow-hidden">
              <RecordTable.Provider
                columns={logColumns}
                data={logs}
                className="w-full"
              >
                <RecordTable>
                  <RecordTable.Header />
                  <RecordTable.Body>
                    <RecordTable.RowList />
                  </RecordTable.Body>
                </RecordTable>
              </RecordTable.Provider>
            </div>
          )}
        </Sheet.Content>
      </Sheet.View>
    </Sheet>
  );
};

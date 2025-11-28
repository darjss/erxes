import {
  BoardCardProps,
  Separator,
  TextOverflowTooltip,
  Button,
} from 'erxes-ui';
import { format } from 'date-fns';
import { IconCalendarEventFilled } from '@tabler/icons-react';
import { useAtomValue, useSetAtom, atom } from 'jotai';
import { allContractsMapState } from '../states/allContractsMapState';
import { contractDetailSheetState } from '../states/contractDetailSheetState';
import { currentUserState, MembersInline } from 'ui-modules';

export const contractBoardItemAtom = atom(
  (get) => (id: string) => get(allContractsMapState)[id],
);

export const ContractsBoardCard = ({ id, column }: BoardCardProps) => {
  const { description, number, _id, date, status, amount, unit } = useAtomValue(
    contractBoardItemAtom,
  )(id);
  const setActiveContract = useSetAtom(contractDetailSheetState);

  const currentUser = useAtomValue(currentUserState);

  const formatAmount = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      onClick={() => setActiveContract(id)}
      className="blk:w-76 overflow-hidden"
    >
      <div className="flex items-center justify-between h-9 px-1.5">
        <div className="text-sm text-muted-foreground">
          {format(new Date(), 'MMM dd, yyyy')}
        </div>

        <div className="text-sm text-muted-foreground">
          {format(new Date(), 'MMM dd, yyyy')}
        </div>
      </div>
      <Separator />
      <div className="p-3 flex flex-col gap-3 overflow-hidden">
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="font-semibold">{description || 'No description'}</div>
          <div className="text-accent-foreground uppercase">
            {number ? `#${number}` : unit ? `Unit ${unit}` : `${_id}`}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {status && (
            <div className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">
              {status}
            </div>
          )}
        </div>
        {amount && (
          <div className="text-sm font-semibold">{formatAmount(amount)}</div>
        )}
      </div>
      <Separator />
      <div className="h-9 flex items-center justify-between px-1.5">
        <div className="flex items-center gap-1 font-medium text-muted-foreground">
          <MembersInline memberIds={[currentUser?._id || '']} />
        </div>
        {status && (
          <div className="text-xs text-muted-foreground capitalize">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

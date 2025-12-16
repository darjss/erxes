import { BoardCardProps, Separator } from 'erxes-ui';
import { format } from 'date-fns';

import { useAtomValue, useSetAtom, atom } from 'jotai';
import { allOpptysMapState } from '@/oppty/states/allOpptysMapState';
import { opptyDetailSheetState } from '@/oppty/states/opptyDetailSheetState';
import { currentUserState, MembersInline } from 'ui-modules';

export const opptyBoardItemAtom = atom(
  (get) => (id: string) => get(allOpptysMapState)[id],
);

export const OpptysBoardCard = ({ id, column }: BoardCardProps) => {
  const { startDate, targetDate, status } =
    useAtomValue(opptyBoardItemAtom)(id);
  const setActiveOppty = useSetAtom(opptyDetailSheetState);

  const currentUser = useAtomValue(currentUserState);

  return (
    <div
      onClick={() => setActiveOppty(id)}
      className="blk:w-76 overflow-hidden"
    >
      <div className="flex items-center justify-between h-9 px-1.5">
        <div className="text-sm text-muted-foreground">
          {format(new Date(Number(startDate || new Date())), 'MMM dd, yyyy')}
        </div>

        <div className="text-sm text-muted-foreground">
          {format(new Date(Number(targetDate || new Date())), 'MMM dd, yyyy')}
        </div>
      </div>
      <Separator />

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

import { BoardCardProps, Button, Separator, Skeleton } from 'erxes-ui';
import { IconCalendarEventFilled } from '@tabler/icons-react';
import { format } from 'date-fns';

import { useAtomValue, atom } from 'jotai';
import { allOpptysMapState } from '@/oppty/states/allOpptysMapState';
import { MembersInline, useCustomerDetail } from 'ui-modules';
import { useBuildings } from '@/building/hooks/useBuildings';
import { useQueryState } from 'erxes-ui';
import { SelectCustomerSource } from '@/oppty/components/SelectCustomerSource';

export const opptyBoardItemAtom = atom(
  (get) => (id: string) => get(allOpptysMapState)[id],
);

const parseDate = (value: any) => {
  if (!value) return null;
  const num = Number(value);
  return new Date(isNaN(num) ? value : num);
};

export const OpptysBoardCard = ({ id, column }: BoardCardProps) => {
  const oppty = useAtomValue(opptyBoardItemAtom)(id);
  const [, setActiveOpptyId] = useQueryState<string>('activeOpptyId');

  const {
    _id,
    customerId,
    propertyRows,
    assignedUserId,
    createdAt,
    number,
    customerSource,
    startDate,
    targetDate,
    projectId,
  } = oppty;

  const rows = propertyRows || [];
  const rowsWithUnit = rows.filter((r) => r.unitId);
  const rowCount = rows.length;

  const { buildings = [] } = useBuildings({
    projectId: projectId || '',
  });

  const { customerDetail, loading: customerLoading } = useCustomerDetail(
    { variables: { _id: customerId }, skip: !customerId },
    true,
  );

  const customerDisplayName = customerDetail
    ? [customerDetail.firstName, customerDetail.lastName]
        .filter(Boolean)
        .join(' ') || customerDetail.primaryPhone || 'Unnamed'
    : '';

  const firstRow = rows[0];
  const firstBuilding = firstRow
    ? buildings.find((b) => b._id === firstRow.buildingId)
    : null;

  return (
    <div onClick={() => setActiveOpptyId(_id)}>
      <div className="flex flex-col gap-1 p-3">
        {number && (
          <span className="text-accent-foreground text-xs uppercase">
            #{number}
          </span>
        )}
        <div className="flex flex-col gap-1">
          {customerLoading ? (
            <Skeleton className="h-4 w-28 rounded" />
          ) : (
            <h5 className="font-semibold truncate">
              {customerDisplayName}
              {customerSource && (
                <span className="text-accent-foreground font-normal text-xs ml-1">
                  ({SelectCustomerSource.OPTIONS.find((o) => o.value === customerSource)?.label || customerSource})
                </span>
              )}
            </h5>
          )}
        </div>
        {(startDate || targetDate) && (
          <div className="text-accent-foreground text-xs flex items-center gap-1">
            {startDate && parseDate(startDate) && (
              <span>{format(parseDate(startDate) as Date, 'MMM dd')}</span>
            )}
            {startDate && targetDate && <span>-</span>}
            {targetDate && parseDate(targetDate) && (
              <span>{format(parseDate(targetDate) as Date, 'MMM dd')}</span>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-1 mt-1">
          {firstBuilding && (
            <Button
              variant="secondary"
              size="sm"
              className="h-6 text-xs pointer-events-none"
            >
              {firstBuilding.name}
              {rowCount > 1 && (
                <span className="text-muted-foreground ml-0.5">
                  +{rowCount - 1}
                </span>
              )}
            </Button>
          )}
          {rowsWithUnit.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              className="h-6 text-xs pointer-events-none"
            >
              {rowsWithUnit.length} unit{rowsWithUnit.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>
      <Separator />
      <div className="h-9 flex items-center justify-between px-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground px-1 hover:bg-background"
        >
          <IconCalendarEventFilled />
          {createdAt && parseDate(createdAt) && (
            <span>{format(parseDate(createdAt) as Date, 'MMM dd, yyyy')}</span>
          )}
        </Button>
        {assignedUserId && (
          <MembersInline.Provider memberIds={[assignedUserId]}>
            <MembersInline.Avatar />
          </MembersInline.Provider>
        )}
      </div>
    </div>
  );
};

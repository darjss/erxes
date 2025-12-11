import { Board, BoardColumnProps, BoardItemProps } from 'erxes-ui';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { IOppty } from '@/oppty/types/opptyTypes';
import type { DragEndEvent } from '@dnd-kit/core';
import { allOpptysMapState } from '@/oppty/states/allOpptysMapState';
import { fetchedOpptysState } from '@/oppty/states/fetchedOpptysState';
import { opptyCountByBoardAtom } from '@/oppty/states/opptyCountByBoardAtom';
// import { useUpdateOppty } from '../hooks/useManageOppty'; // TODO: Enable when backend is ready
import { useEffect } from 'react';
import { OpptysBoardCard } from '@/oppty/components/OpptysBoardCard';
import { OPPTY_CUSTOMER_SOURCES, OPPTY_STATUSES } from '../constants/oppty';

const columns = [
  {
    id: 'lead',
    name: 'Шинэ – Байр сонгоогүй',
    type: 'new',
    color: 'blue',
  },
  {
    id: 'picked',
    name: 'Шинэ – Байр сонгосон',
    type: 'in-progress',
    color: 'green',
  },
  {
    id: 'connected',
    name: 'Холбогдсон',
    type: 'in-progress',
    color: 'yellow',
  },
  {
    id: 'schedule',
    name: 'Уулзалт товлосон',
    type: 'in-progress',
    color: 'yellow',
  },
  {
    id: 'negotiation',
    name: 'Хэлэлцээр',
    type: 'in-progress',
    color: 'yellow',
  },
  {
    id: 'ordered',
    name: 'Захиалсан',
    type: 'done',
    color: 'green',
  },
  { id: 'closed', name: 'Дууссан', type: 'completed', color: 'green' },
  {
    id: 'lost',
    name: 'Алдагдсан',
    type: 'cancelled',
    color: 'red',
  },
];

function mapOpptyStatusToColumn(
  status?: (typeof OPPTY_STATUSES)[keyof typeof OPPTY_STATUSES],
): string {
  switch (status) {
    case OPPTY_STATUSES.NEW_LEAD_UNASSIGNED:
      return 'lead';
    case OPPTY_STATUSES.ASSIGNED_IN_CONTACT:
      return 'picked';
    case OPPTY_STATUSES.QUALIFIED_LEAD:
      return 'connected';
    case OPPTY_STATUSES.UNIT_SHORTLIST_CREATED:
      return 'schedule';
    case OPPTY_STATUSES.PROPERTY_VIEWING:
      return 'negotiation';
    case OPPTY_STATUSES.UNIT_SELECTED:
      return 'ordered';
    case OPPTY_STATUSES.NEGOTIATION:
      return 'negotiation';
    case OPPTY_STATUSES.RESERVATION:
      return 'ordered';
    case OPPTY_STATUSES.CONTRACT_DRAFTING_SIGNING:
      return 'ordered';
    case OPPTY_STATUSES.CLOSED_SUCCESSFUL:
      return 'closed';
    case OPPTY_STATUSES.CLOSED_UNSUCCESSFUL:
      return 'closed';
    case OPPTY_STATUSES.CANCELLED:
      return 'lost';
    default:
      return 'lead';
  }
}

function mapColumnToOpptyStatus(
  columnId: string,
): (typeof OPPTY_STATUSES)[keyof typeof OPPTY_STATUSES] {
  switch (columnId) {
    case 'lead':
      return OPPTY_STATUSES.NEW_LEAD_UNASSIGNED;
    case 'ordered':
      return OPPTY_STATUSES.CONTRACT_DRAFTING_SIGNING;
    case 'closed':
      return OPPTY_STATUSES.CLOSED_SUCCESSFUL;
    case 'lost':
      return OPPTY_STATUSES.CANCELLED;
    default:
      return OPPTY_STATUSES.NEW_LEAD_UNASSIGNED;
  }
}

function transformOpptysToBoardItems(opptys: IOppty[]): BoardItemProps[] {
  return opptys.map((oppty) => ({
    id: oppty._id,
    column: mapOpptyStatusToColumn(oppty.status),
    sort: oppty.updatedAt || new Date().toISOString(),
  }));
}

const mockOpptys: IOppty[] = [
  {
    _id: '1',
    description: 'Test oppty',
    customerId: '1',
    unitTypes: ['1'],
    customerSource: OPPTY_CUSTOMER_SOURCES.WEBSITE,
    status: OPPTY_STATUSES.NEW_LEAD_UNASSIGNED,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    description: 'Test oppty',
    customerId: '2',
    unitTypes: ['2'],
    customerSource: OPPTY_CUSTOMER_SOURCES.WEBSITE,
    status: OPPTY_STATUSES.ASSIGNED_IN_CONTACT,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    description: 'Test oppty',
    customerId: '3',
    unitTypes: ['3'],
    customerSource: OPPTY_CUSTOMER_SOURCES.WEBSITE,
    status: OPPTY_STATUSES.QUALIFIED_LEAD,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const OpptysBoard = () => {
  const allOpptysMap = useAtomValue(allOpptysMapState);
  const [opptys, setOpptys] = useAtom(fetchedOpptysState);
  const setOpptyCountByBoard = useSetAtom(opptyCountByBoardAtom);
  const setAllOpptysMap = useSetAtom(allOpptysMapState);

  useEffect(() => {
    const boardItems = transformOpptysToBoardItems(mockOpptys);
    setOpptys(boardItems);

    const opptysMap: Record<string, IOppty> = {};
    mockOpptys.forEach((oppty) => {
      opptysMap[oppty._id] = oppty;
    });
    setAllOpptysMap(opptysMap);

    const countByBoard: Record<string, number> = {};
    boardItems.forEach((item) => {
      countByBoard[item.column] = (countByBoard[item.column] || 0) + 1;
    });
    setOpptyCountByBoard(countByBoard);
  }, [setOpptys, setAllOpptysMap, setOpptyCountByBoard]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const activeItem = allOpptysMap[active.id as string];
    const overItem = allOpptysMap[over.id as string];
    const overColumn = overItem?.status
      ? mapOpptyStatusToColumn(overItem.status)
      : columns.find((col) => col.id === over.id)?.id || columns[0]?.id;

    if (
      !activeItem ||
      mapOpptyStatusToColumn(activeItem.status) === overColumn
    ) {
      return;
    }

    const newStatus = mapColumnToOpptyStatus(overColumn);

    // TODO: Connect to backend when ready
    // updateOppty(activeItem._id, {
    //   unit: activeItem.unit,
    //   number: activeItem.number,
    //   currency: activeItem.currency,
    //   date: activeItem.date,
    //   amount: activeItem.amount,
    //   amountType: activeItem.amountType,
    //   status: newStatus,
    //   startDate: activeItem.startDate,
    //   endDate: activeItem.endDate,
    //   isLifeTime: activeItem.isLifeTime,
    //   party: activeItem.party,
    //   paymentPlan: activeItem.paymentPlan,
    //   user: activeItem.user,
    // });

    // Update oppty in map with new status
    setAllOpptysMap((prev) => ({
      ...prev,
      [activeItem._id]: {
        ...prev[activeItem._id],
        status: newStatus,
      },
    }));

    setOpptys((prev) =>
      prev.map((oppty) => {
        if (oppty.id === activeItem._id) {
          return {
            ...oppty,
            column: overColumn,
            sort: new Date().toISOString(),
          };
        }
        return oppty;
      }),
    );

    const previousColumn = mapOpptyStatusToColumn(activeItem.status);
    setOpptyCountByBoard((prev) => ({
      ...prev,
      [previousColumn]: (prev[previousColumn] || 1) - 1,
      [overColumn]: (prev[overColumn] || 0) + 1,
    }));
  };

  return (
    <Board.Provider
      columns={columns}
      data={opptys}
      onDragEnd={handleDragEnd}
      boardId="opptys"
    >
      {(column) => (
        <Board id={column.id} key={column.id} sortBy="updated">
          <OpptysBoardCards column={column} />
        </Board>
      )}
    </Board.Provider>
  );
};

export const OpptysBoardCards = ({ column }: { column: BoardColumnProps }) => {
  const [opptyCards] = useAtom(fetchedOpptysState);
  const [opptyCountByBoard] = useAtom(opptyCountByBoardAtom);

  const boardCards = opptyCards
    .filter((oppty) => oppty.column === column.id)
    .sort((a, b) => {
      if (a.sort && b.sort) {
        return b.sort.toString().localeCompare(a.sort.toString());
      }
      return 0;
    });

  return (
    <>
      <Board.Header>
        <h4 className="capitalize flex items-center gap-1 pl-1">
          {column.name}
          <span className="text-accent-foreground font-medium pl-1">
            {opptyCountByBoard[column.id] || 0}
          </span>
        </h4>
      </Board.Header>
      <Board.Cards id={column.id} items={boardCards.map((oppty) => oppty.id)}>
        {boardCards.map((oppty) => (
          <Board.Card
            key={oppty.id}
            id={oppty.id}
            name={oppty.name || `Oppty ${oppty.id}`}
            column={column.id}
          >
            <OpptysBoardCard id={oppty.id} column={column.id} />
          </Board.Card>
        ))}
      </Board.Cards>
    </>
  );
};

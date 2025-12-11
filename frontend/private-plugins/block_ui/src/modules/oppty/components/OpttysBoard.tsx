import {
  Board,
  BoardColumnProps,
  EnumCursorDirection,
  Skeleton,
} from 'erxes-ui';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { IOppty } from '@/oppty/types/opptyTypes';
import type { DragEndEvent } from '@dnd-kit/core';
import { allOpptysMapState } from '@/oppty/states/allOpptysMapState';
import { fetchedOpptysState } from '@/oppty/states/fetchedOpptysState';
import { opptyCountByProjectAtom } from '@/oppty/states/opptyCountByProjectAtom';

import { useEffect } from 'react';
import { OpptysBoardCard } from '@/oppty/components/OpptysBoardCard';

import { useOpptys } from '@/oppty/hooks/useGetOpptys';
import { clsx } from 'clsx';
import { useInView } from 'react-intersection-observer';

const columns = [
  {
    id: 'new_lead_unassigned',
    name: 'Шинэ – Байр сонгоогүй',
    type: 'new',
    color: 'blue',
  },
  {
    id: 'assigned_in_contact',
    name: 'Шинэ – Байр сонгосон',
    type: 'in-progress',
    color: 'green',
  },

  {
    id: 'qualified_lead',
    name: 'Холбогдсон',
    type: 'in-progress',
    color: 'yellow',
  },
  {
    id: 'unit_shortlist_created',
    name: 'Байраа ',
    type: 'in-progress',
    color: 'yellow',
  },
  {
    id: 'property_viewing',
    name: 'Байр үзүүлэх',
    type: 'in-progress',
    color: 'yellow',
  },
  {
    id: 'unit_selected',
    name: 'Байраа сонгосон',
    type: 'done',
    color: 'green',
  },
  { id: 'negotiation', name: 'Хэлэлцээр', type: 'completed', color: 'green' },
  {
    id: 'reservation',
    name: 'Захиалсан',
    type: 'cancelled',
    color: 'red',
  },
  {
    id: 'contract_drafting_signing',
    name: 'Гэрээний драфт',
    type: 'completed',
    color: 'green',
  },
  {
    id: 'closed_successful',
    name: 'Гэрээ хийгдсэн',
    type: 'completed',
    color: 'green',
  },
  {
    id: 'closed_unsuccessful',
    name: 'Гэрээ хийгдээгүй',
    type: 'completed',
    color: 'green',
  },
];

export const OpptysBoard = ({ projectId }: { projectId: string }) => {
  const allOpptysMap = useAtomValue(allOpptysMapState);
  // const { updateOppty } = useUpdateOppty();

  const [opptys, setOpptys] = useAtom(fetchedOpptysState);
  const setOpptyCountByProject = useSetAtom(opptyCountByProjectAtom);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const activeItem = allOpptysMap[active.id as string];
    const overItem = allOpptysMap[over.id as string];
    const overColumn =
      overItem?.status ||
      columns?.find((col) => col.id === over.id)?.id ||
      columns?.[0]?.id;

    if (activeItem?.status === overColumn) {
      return;
    }
    // updateOppty({
    //   variables: {
    //     _id: activeItem?._id,
    //     status: overColumn,
    //   },
    // });
    setOpptys((prev) =>
      prev.map((oppty) => {
        if (oppty.id === activeItem?._id) {
          return {
            ...oppty,
            column: overColumn,
            sort: new Date().toISOString(),
          };
        }
        return oppty;
      }),
    );
    setOpptyCountByProject((prev) => ({
      ...prev,
      [activeItem?.status]: prev[activeItem?.status] - 1 || 0,
      [overColumn]: (prev[overColumn] || 0) + 1,
    }));
  };

  return (
    <Board.Provider
      columns={columns}
      data={opptys}
      onDragEnd={handleDragEnd}
      boardId={clsx('opptys-board', projectId)}
    >
      {(column) => (
        <Board id={column.id} key={column.id} sortBy="updated" className="w-80">
          <OpptysBoardCards column={column} projectId={projectId} />
        </Board>
      )}
    </Board.Provider>
  );
};

export const OpptysBoardCards = ({
  column,
  projectId,
}: {
  column: BoardColumnProps;
  projectId: string;
}) => {
  const [opptyCards, setOpptyCards] = useAtom(fetchedOpptysState);
  const [opptyCountByProject, setOpptyCountByProject] = useAtom(
    opptyCountByProjectAtom,
  );

  const boardCards = opptyCards
    .filter((oppty) => oppty.column === column.id)
    .sort((a, b) => {
      if (a.sort && b.sort) {
        return b.sort.toString().localeCompare(a.sort.toString());
      }
      return 0;
    });

  const { opptys, totalCount, loading, handleFetchMore } = useOpptys(
    projectId,
    {
      variables: {
        status: column.id,
      },
    },
  );

  const setAllOpptysMap = useSetAtom(allOpptysMapState);

  useEffect(() => {
    if (opptys) {
      setOpptyCards((prev) => {
        const previousopptys = prev.filter(
          (optty) => !opptys.some((t) => t._id === optty.id),
        );
        return [
          ...previousopptys,
          ...opptys.map((oppty) => ({
            id: oppty._id,
            column: oppty.status,
            sort: oppty.updatedAt,
          })),
        ];
      });
      setAllOpptysMap((prev) => {
        const newOpptys = opptys.reduce((acc, oppty) => {
          acc[oppty._id] = oppty;
          return acc;
        }, {} as Record<string, IOppty>);
        return { ...prev, ...newOpptys };
      });
    }
  }, [opptys, setOpptyCards, setAllOpptysMap, column.id]);

  useEffect(() => {
    if (totalCount) {
      setOpptyCountByProject((prev) => ({
        ...prev,
        [column.id]: totalCount || 0,
      }));
    }
  }, [totalCount, setOpptyCountByProject, column.id]);

  return (
    <>
      <Board.Header>
        <h4 className="capitalize flex items-center gap-1 pl-1">
          {column.name}
          <span className="text-accent-foreground font-medium pl-1">
            {loading ? (
              <Skeleton className="size-4 rounded" />
            ) : (
              opptyCountByProject[column.id] || 0
            )}
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
        <OpptysCardsFetchMore
          totalCount={opptyCountByProject[column.id] || 0}
          currentLength={boardCards.length}
          handleFetchMore={() =>
            handleFetchMore({ direction: EnumCursorDirection.FORWARD })
          }
        />
      </Board.Cards>
    </>
  );
};

export const OpptysCardsFetchMore = ({
  totalCount,
  handleFetchMore,
  currentLength,
}: {
  totalCount: number;
  handleFetchMore: () => void;
  currentLength: number;
}) => {
  const { ref: bottomRef } = useInView({
    onChange: (inView) => inView && handleFetchMore(),
  });

  if (!totalCount || currentLength >= totalCount || currentLength === 0) {
    return null;
  }

  return (
    <div ref={bottomRef}>
      <Skeleton className="p-12 w-full rounded shadow-xs opacity-80" />
    </div>
  );
};

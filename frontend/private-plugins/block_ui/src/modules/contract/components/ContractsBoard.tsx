import {
  Board,
  BoardColumnProps,
  BoardItemProps,
  Spinner,
} from 'erxes-ui';
import { useParams } from 'react-router-dom';
import { ContractStatus } from '../types/contractTypes';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  allContractsMapState,
  IContractWithDescription,
} from '../states/allContractsMapState';
import { fetchedContractsState } from '../states/fetchedContractsState';
import { contractCountByBoardAtom } from '../states/contractCountByBoardAtom';
import { useEffect, useMemo } from 'react';
import { ContractsBoardCard } from './ContractsBoardCard';
import { useBlockContractStatusesByType } from '@/contract-status/hooks/useGetBlockContractStatuses';
import { useContracts } from '../hooks/useContracts';
import { useUpdateContractStatus } from '../hooks/useManageContract';
import { IBlockContractStatus } from '@/contract-status/types';
import { toast } from 'erxes-ui';

const STATUS_TYPE_TO_ENUM: Record<string, ContractStatus> = {
  reserved: ContractStatus.RESERVED,
  draft: ContractStatus.DRAFT,
  signed: ContractStatus.SIGNED,
  cancelled: ContractStatus.CANCELLED,
  lost: ContractStatus.CANCELLED,
};

const TYPE_ORDER = ['reserved', 'draft', 'signed', 'lost', 'cancelled'];

const sortStatuses = (statuses: IBlockContractStatus[]) =>
  [...statuses].sort((a, b) => {
    const ti = TYPE_ORDER.indexOf(a.type);
    const tj = TYPE_ORDER.indexOf(b.type);
    if (ti !== tj) return ti - tj;
    return (a.order || 0) - (b.order || 0);
  });

const buildContractToColumn =
  (statuses: IBlockContractStatus[]) =>
  (contractStatus: ContractStatus | undefined): string => {
    const target = contractStatus ?? ContractStatus.DRAFT;
    const inType = statuses
      .filter((s) => s.type === target)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    if (inType[0]) return inType[0]._id;
    const fallback = sortStatuses(statuses)[0];
    return fallback?._id || '';
  };

function transformContractsToBoardItems(
  contracts: IContractWithDescription[],
  contractToColumn: (status: ContractStatus | undefined) => string,
): BoardItemProps[] {
  return contracts.map((contract) => ({
    id: contract._id,
    column: contractToColumn(contract.status),
    sort: contract.date || new Date().toISOString(),
  }));
}

export const ContractsBoard = () => {
  const { projectId: projectIdParam, id } = useParams<{
    projectId?: string;
    id?: string;
  }>();
  const projectId = projectIdParam || id || '';
  const { statuses, loading: statusLoading } = useBlockContractStatusesByType({
    projectId,
  });
  const { contracts, loading: contractsLoading } = useContracts();

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Select a project to view contract pipeline.
      </div>
    );
  }

  if (statusLoading || contractsLoading) return <Spinner />;

  const columns = sortStatuses(statuses || []).map((status) => ({
    id: status._id,
    name: status.name,
    color: status.color || '#A0A0A0',
  }));

  if (columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        No contract statuses configured for this project.
      </div>
    );
  }

  return (
    <ContractsBoardInner
      columns={columns}
      contracts={contracts || []}
      statuses={statuses || []}
    />
  );
};

const ContractsBoardInner = ({
  columns,
  contracts: fetchedContracts,
  statuses,
}: {
  columns: { id: string; name: string; color: string }[];
  contracts: IContractWithDescription[];
  statuses: IBlockContractStatus[];
}) => {
  const allContractsMap = useAtomValue(allContractsMapState);
  const [contracts, setContracts] = useAtom(fetchedContractsState);
  const setContractCountByBoard = useSetAtom(contractCountByBoardAtom);
  const setAllContractsMap = useSetAtom(allContractsMapState);
  const { updateContractStatus } = useUpdateContractStatus();

  const contractToColumn = useMemo(
    () => buildContractToColumn(statuses),
    [statuses],
  );

  useEffect(() => {
    const boardItems = transformContractsToBoardItems(
      fetchedContracts,
      contractToColumn,
    );
    setContracts(boardItems);

    const contractsMap: Record<string, IContractWithDescription> = {};
    fetchedContracts.forEach((contract) => {
      contractsMap[contract._id] = contract;
    });
    setAllContractsMap(contractsMap);

    const countByBoard: Record<string, number> = {};
    boardItems.forEach((item) => {
      countByBoard[item.column] = (countByBoard[item.column] || 0) + 1;
    });
    setContractCountByBoard(countByBoard);
  }, [
    fetchedContracts,
    contractToColumn,
    setContracts,
    setAllContractsMap,
    setContractCountByBoard,
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const activeItem = allContractsMap[active.id as string];
    if (!activeItem) return;

    const overItem = allContractsMap[over.id as string];
    const overColumn = overItem
      ? contractToColumn(overItem.status)
      : columns.find((col) => col.id === over.id)?.id || columns[0]?.id;

    if (!overColumn || contractToColumn(activeItem.status) === overColumn) {
      return;
    }

    const overStatus = statuses.find((s) => s._id === overColumn);
    const newStatus = overStatus
      ? STATUS_TYPE_TO_ENUM[overStatus.type] || ContractStatus.DRAFT
      : ContractStatus.DRAFT;

    updateContractStatus(activeItem._id, newStatus).catch((error: any) => {
      toast({
        title: 'Failed to update contract status',
        description: error?.message || 'Please try again',
        variant: 'destructive',
      });
    });

    setAllContractsMap((prev) => ({
      ...prev,
      [activeItem._id]: {
        ...prev[activeItem._id],
        status: newStatus,
      },
    }));

    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.id === activeItem._id) {
          return {
            ...contract,
            column: overColumn,
            sort: new Date().toISOString(),
          };
        }
        return contract;
      }),
    );

    const previousColumn = contractToColumn(activeItem.status);
    setContractCountByBoard((prev) => ({
      ...prev,
      [previousColumn]: (prev[previousColumn] || 1) - 1,
      [overColumn]: (prev[overColumn] || 0) + 1,
    }));
  };

  return (
    <Board.Provider
      columns={columns}
      data={contracts}
      onDragEnd={handleDragEnd}
      boardId="contracts"
    >
      {(column) => (
        <Board id={column.id} key={column.id} sortBy="updated">
          <ContractsBoardCards column={column} />
        </Board>
      )}
    </Board.Provider>
  );
};

export const ContractsBoardCards = ({
  column,
}: {
  column: BoardColumnProps;
}) => {
  const [contractCards] = useAtom(fetchedContractsState);
  const [contractCountByBoard] = useAtom(contractCountByBoardAtom);

  const boardCards = contractCards
    .filter((contract) => contract.column === column.id)
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
          <span
            className="rounded-full size-2"
            style={{ backgroundColor: (column as any).color || '#A0A0A0' }}
          />
          {column.name}
          <span className="text-accent-foreground font-medium pl-1">
            {contractCountByBoard[column.id] || 0}
          </span>
        </h4>
      </Board.Header>
      <Board.Cards
        id={column.id}
        items={boardCards.map((contract) => contract.id)}
      >
        {boardCards.map((contract) => (
          <Board.Card
            key={contract.id}
            id={contract.id}
            name={contract.name || `Contract ${contract.id}`}
            column={column.id}
          >
            <ContractsBoardCard id={contract.id} column={column.id} />
          </Board.Card>
        ))}
      </Board.Cards>
    </>
  );
};

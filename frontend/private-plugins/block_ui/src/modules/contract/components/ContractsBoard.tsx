import { Board, BoardColumnProps, BoardItemProps } from 'erxes-ui';
import { ContractStatus, ContractPartyType } from '../types/contractTypes';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  allContractsMapState,
  IContractWithDescription,
} from '../states/allContractsMapState';
import { fetchedContractsState } from '../states/fetchedContractsState';
import { contractCountByBoardAtom } from '../states/contractCountByBoardAtom';
// import { useUpdateContract } from '../hooks/useManageContract'; // TODO: Enable when backend is ready
import { useEffect } from 'react';
import { ContractsBoardCard } from './ContractsBoardCard';

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

function mapContractStatusToColumn(status?: ContractStatus): string {
  switch (status) {
    case ContractStatus.DRAFT:
      return 'lead';
    case ContractStatus.SIGNED:
      return 'ordered';
    case ContractStatus.COMPLETED:
      return 'closed';
    case ContractStatus.CANCELLED:
      return 'lost';
    default:
      return 'lead';
  }
}

function mapColumnToContractStatus(columnId: string): ContractStatus {
  switch (columnId) {
    case 'lead':
      return ContractStatus.DRAFT;
    case 'ordered':
      return ContractStatus.SIGNED;
    case 'closed':
      return ContractStatus.COMPLETED;
    case 'lost':
      return ContractStatus.CANCELLED;
    default:
      return ContractStatus.DRAFT;
  }
}

const mockContractsDraft: IContractWithDescription[] = [
  {
    _id: 'contract-001',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 8300000,
    amountType: undefined,
    status: ContractStatus.DRAFT,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description:
      'A блокын орон сууцны худалдан авалтын гэрээ. Хүсэлтийн шатанд.',
  },
  {
    _id: 'contract-009',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 6700000,
    amountType: undefined,
    status: ContractStatus.DRAFT,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'Гэрээний маягт эх хэлбэрээр бэлтгэгдсэн.',
  },
  {
    _id: 'contract-014',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 9020000,
    amountType: undefined,
    status: ContractStatus.DRAFT,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'Гэрээ боловсруулагдаж байна.',
  },
  {
    _id: 'contract-018',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 17700000,
    amountType: undefined,
    status: ContractStatus.DRAFT,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'K блокын 222 тоот гэрээний төсөл.',
  },
];

const mockContractsSigned: IContractWithDescription[] = [
  {
    _id: 'contract-002',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 12200000,
    amountType: undefined,
    status: ContractStatus.SIGNED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description:
      'B блокын 103 дугаар байрны борлуулалтын гэрээ, хүчин төгөлдөр.',
  },
  {
    _id: 'contract-005',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 11500000,
    amountType: undefined,
    status: ContractStatus.SIGNED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'D блокын 45 дугаар байрны төлбөрийн төлөвлөгөө.',
  },
  {
    _id: 'contract-008',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 15000000,
    amountType: undefined,
    status: ContractStatus.SIGNED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'F блокын гэрээ идэвхтэй төлөвт.',
  },
  {
    _id: 'contract-011',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 10400000,
    amountType: undefined,
    status: ContractStatus.SIGNED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'Ж блокын 65 тоот гэрээ.',
  },
  {
    _id: 'contract-015',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 10800000,
    amountType: undefined,
    status: ContractStatus.SIGNED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'J блокын 82 тоот идэвхтэй харилцагч.',
  },
];

const mockContractsCompleted: IContractWithDescription[] = [
  {
    _id: 'contract-003',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 9100000,
    amountType: undefined,
    status: ContractStatus.COMPLETED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'C блокын гэрээ захиалсан төлөвт байна.',
  },
  {
    _id: 'contract-007',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 13200000,
    amountType: undefined,
    status: ContractStatus.COMPLETED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'E блокын 51 байр урьдчилгаа төлбөр хүлээгдэж байна.',
  },
  {
    _id: 'contract-010',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 37000000,
    amountType: undefined,
    status: ContractStatus.COMPLETED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'Penthouse байрны захиалгын гэрээ.',
  },
  {
    _id: 'contract-016',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 7740000,
    amountType: undefined,
    status: ContractStatus.COMPLETED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'Захиалсан гэрээ, картыг боловсруулж байна.',
  },
  {
    _id: 'contract-020',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 8580000,
    amountType: undefined,
    status: ContractStatus.COMPLETED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'C блок гэрээ хүлээгдэж байна.',
  },
];

const mockContractsCancelled: IContractWithDescription[] = [
  {
    _id: 'contract-004',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 7650000,
    amountType: undefined,
    status: ContractStatus.CANCELLED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'A блокын 15 дугаар байрны гэрээ дуусгавар болсон.',
  },
  {
    _id: 'contract-006',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 8900000,
    amountType: undefined,
    status: ContractStatus.CANCELLED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'Гэрээ цуцлагдсан.',
  },
  {
    _id: 'contract-012',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 19800000,
    amountType: undefined,
    status: ContractStatus.CANCELLED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'L блокын шар байрны гэрээ дууссан.',
  },
  {
    _id: 'contract-013',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 8250000,
    amountType: undefined,
    status: ContractStatus.CANCELLED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'Гэрээ хаагдсан - өөр байранд шилжсэн.',
  },
  {
    _id: 'contract-017',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 13600000,
    amountType: undefined,
    status: ContractStatus.CANCELLED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'A блокын 26 тоот гэрээ худалдааны хугацаанд дууссан.',
  },
  {
    _id: 'contract-019',
    unit: '',
    number: undefined,
    currency: undefined,
    date: undefined,
    amount: 18200000,
    amountType: undefined,
    status: ContractStatus.CANCELLED,
    startDate: undefined,
    endDate: undefined,
    isLifeTime: undefined,
    party: { type: ContractPartyType.CUSTOMER, id: '' },
    paymentPlan: undefined,
    user: undefined,
    description: 'Б блокын гэрээ алдагдсан (төлбөр төлөгдөөгүй).',
  },
];

const mockContracts: IContractWithDescription[] = [
  ...mockContractsDraft,
  ...mockContractsSigned,
  ...mockContractsCompleted,
  ...mockContractsCancelled,
];

function transformContractsToBoardItems(
  contracts: IContractWithDescription[],
): BoardItemProps[] {
  return contracts.map((contract) => ({
    id: contract._id,
    column: mapContractStatusToColumn(contract.status),
    sort: contract.date || new Date().toISOString(),
  }));
}

export const ContractsBoard = () => {
  const allContractsMap = useAtomValue(allContractsMapState);
  const [contracts, setContracts] = useAtom(fetchedContractsState);
  const setContractCountByBoard = useSetAtom(contractCountByBoardAtom);
  const setAllContractsMap = useSetAtom(allContractsMapState);

  useEffect(() => {
    const boardItems = transformContractsToBoardItems(mockContracts);
    setContracts(boardItems);

    const contractsMap: Record<string, IContractWithDescription> = {};
    mockContracts.forEach((contract) => {
      contractsMap[contract._id] = contract;
    });
    setAllContractsMap(contractsMap);

    const countByBoard: Record<string, number> = {};
    boardItems.forEach((item) => {
      countByBoard[item.column] = (countByBoard[item.column] || 0) + 1;
    });
    setContractCountByBoard(countByBoard);
  }, [setContracts, setAllContractsMap, setContractCountByBoard]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const activeItem = allContractsMap[active.id as string];
    const overItem = allContractsMap[over.id as string];
    const overColumn = overItem?.status
      ? mapContractStatusToColumn(overItem.status)
      : columns.find((col) => col.id === over.id)?.id || columns[0]?.id;

    if (
      !activeItem ||
      mapContractStatusToColumn(activeItem.status) === overColumn
    ) {
      return;
    }

    const newStatus = mapColumnToContractStatus(overColumn);

    // TODO: Connect to backend when ready
    // updateContract(activeItem._id, {
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

    // Update contract in map with new status
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

    const previousColumn = mapContractStatusToColumn(activeItem.status);
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

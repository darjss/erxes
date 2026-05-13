import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Sidebar,
  Spinner,
  Table,
  useQueryState,
} from 'erxes-ui';
import { useAtom } from 'jotai';
import { format } from 'date-fns';
import { useContract } from '@/contract/hooks/useContracts';
import { contractDetailSheetState } from '@/contract/states/contractDetailSheetState';
import { IContract, ContractStatus } from '@/contract/types/contractTypes';
import { ContractEditSheet } from './ContractEditSheet';
import { ContractActivityLog } from './ContractActivityLog';
import { useUnit } from '@/unit/hooks/useUnit';
import { useCustomerDetail, RelationWidgetSideTabs } from 'ui-modules';
import { ContractPartyType } from '@/contract/types/contractTypes';
import { useBlockContractStatusesByType } from '@/contract-status/hooks/useGetBlockContractStatuses';
import { useParams } from 'react-router-dom';

const CONTRACT_TABS = {
  OVERVIEW: 'overview',
  PAYMENT_PLAN: 'payment-plan',
  ACTIVITY_LOG: 'activity-log',
} as const;
type ContractTab = (typeof CONTRACT_TABS)[keyof typeof CONTRACT_TABS];

const CONTRACT_STATUS_VARIANT: Record<
  string,
  'default' | 'success' | 'warning' | 'destructive' | 'info' | 'secondary'
> = {
  [ContractStatus.RESERVED]: 'warning',
  [ContractStatus.DRAFT]: 'secondary',
  [ContractStatus.SIGNED]: 'success',
  [ContractStatus.COMPLETED]: 'success',
  [ContractStatus.CANCELLED]: 'destructive',
};

const formatDate = (value: any): string | undefined => {
  if (!value) return undefined;
  const num = Number(value);
  const date = new Date(isNaN(num) ? value : num);
  if (isNaN(date.getTime())) return undefined;
  return format(date, 'dd.MM.yyyy');
};

const renderRow = (
  label: string,
  value: React.ReactNode,
  isFirst = false,
  isLast = false,
) => (
  <Table.Row>
    <Table.Cell
      className={`bg-sidebar h-auto min-h-10 p-2 bt:whitespace-auto ${
        isFirst ? 'bt:rounded-tl-lg' : ''
      } ${isLast ? 'bt:rounded-bl-lg' : ''}`}
    >
      {label}
    </Table.Cell>
    <Table.Cell
      className={`min-h-10 h-auto p-2 whitespace-normal ${
        isFirst ? 'bt:rounded-tr-lg' : ''
      } ${isLast ? 'bt:rounded-br-lg' : ''}`}
    >
      {value == null || value === '' ? '-' : value}
    </Table.Cell>
  </Table.Row>
);

const formatAmount = (amount?: number, currency = 'MNT') => {
  if (amount == null) return '-';
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const ContractDetailSheet = () => {
  const [activeContractId, setActiveContractId] = useAtom(
    contractDetailSheetState,
  );
  const [activeTab, setActiveTab] = useQueryState<ContractTab>(
    'contract_tab',
    {
      defaultValue: CONTRACT_TABS.OVERVIEW,
    },
  );

  const { contract, loading } = useContract(activeContractId || undefined);

  return (
    <FocusSheet
      open={!!activeContractId}
      onOpenChange={(open) => !open && setActiveContractId(null)}
    >
      <FocusSheet.View className="sm:w-full sm:max-w-7xl">
        <FocusSheet.Header title="Contract Detail" />
        <FocusSheet.Content className="flex flex-auto overflow-hidden">
          <FocusSheet.SideBar>
            <Sidebar collapsible="none" className="flex-none border-r w-64">
              <Sidebar.Group>
                <Sidebar.GroupContent>
                  <Sidebar.Menu>
                    {Object.values(CONTRACT_TABS).map((tab) => (
                      <Sidebar.MenuItem key={tab}>
                        <Sidebar.MenuButton
                          onClick={() => setActiveTab(tab)}
                          isActive={activeTab === tab}
                        >
                          {tab.charAt(0).toUpperCase() +
                            tab.slice(1).replace('-', ' ')}
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    ))}
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
            </Sidebar>
          </FocusSheet.SideBar>

          {(!activeTab || activeTab === CONTRACT_TABS.OVERVIEW) && (
            <ScrollArea className="flex-auto h-full">
              <div className="p-4">
                {loading ? (
                  <Spinner />
                ) : !contract ? (
                  <div className="text-muted-foreground">
                    Contract not found
                  </div>
                ) : (
                  <ContractDetailBody contract={contract} />
                )}
              </div>
            </ScrollArea>
          )}
          {activeTab === CONTRACT_TABS.PAYMENT_PLAN && (
            <ScrollArea className="flex-auto h-full">
              <div className="p-4">
                {loading ? (
                  <Spinner />
                ) : !contract ? (
                  <div className="text-muted-foreground">
                    Contract not found
                  </div>
                ) : (
                  <ContractPaymentPlanBody contract={contract} />
                )}
              </div>
            </ScrollArea>
          )}
          {activeTab === CONTRACT_TABS.ACTIVITY_LOG && activeContractId && (
            <ScrollArea className="flex-auto h-full">
              <ContractActivityLog contractId={activeContractId} />
            </ScrollArea>
          )}

          <RelationWidgetSideTabs
            contentId={activeContractId || ''}
            contentType="block:contract"
            customerId={
              contract?.party?.type === ContractPartyType.CUSTOMER
                ? contract.party.id
                : undefined
            }
            hookOptions={{
              hiddenPlugins: ['sales', 'operation'],
              hiddenModules: ['contract', 'company', 'ticket'],
            }}
          />
        </FocusSheet.Content>
        <Sheet.Footer className="flex-none">
          {activeContractId && <ContractEditSheet />}
          <Sheet.Close asChild>
            <Button variant="secondary" className="bg-border">
              Close
            </Button>
          </Sheet.Close>
        </Sheet.Footer>
      </FocusSheet.View>
    </FocusSheet>
  );
};

const ContractDetailBody = ({ contract }: { contract: IContract }) => {
  const { unit } = useUnit(contract.unit);
  const { projectId: projectIdParam, id } = useParams<{
    projectId?: string;
    id?: string;
  }>();
  const projectId = projectIdParam || id || '';
  const { statuses = [] } = useBlockContractStatusesByType({ projectId });

  const matchedStage = statuses
    .filter((s) => s.type === contract.status)
    .sort((a, b) => (a.order || 0) - (b.order || 0))[0];

  const partyId = contract.party?.id;
  const isCustomer = contract.party?.type === ContractPartyType.CUSTOMER;

  const { customerDetail } = useCustomerDetail(
    { variables: { _id: partyId }, skip: !partyId || !isCustomer },
    true,
  );

  const partyLabel = (() => {
    if (!contract.party) return null;
    if (isCustomer && customerDetail) {
      const name =
        [customerDetail.firstName, customerDetail.lastName]
          .filter(Boolean)
          .join(' ') ||
        customerDetail.primaryPhone ||
        customerDetail.primaryEmail ||
        'Unnamed customer';
      return `Customer · ${name}`;
    }
    return `${contract.party.type} · ${contract.party.id}`;
  })();

  const unitLabel = (() => {
    if (!unit) return contract.unit;
    const parts: string[] = [`Unit ${unit.number}`];
    if (unit.unitType?.name) parts.push(unit.unitType.name);
    if (unit.unitType?.size != null) parts.push(`${unit.unitType.size}m²`);
    return parts.join(' · ');
  })();

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="Contract Information">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              {renderRow(
                'Number',
                contract.number ? `#${contract.number}` : null,
                true,
              )}
              {renderRow(
                'Status',
                contract.status ? (
                  <Badge
                    variant={
                      CONTRACT_STATUS_VARIANT[contract.status] || 'default'
                    }
                  >
                    {matchedStage?.name || contract.status}
                  </Badge>
                ) : (
                  '-'
                ),
              )}
              {renderRow('Unit', unitLabel)}
              {renderRow(
                'Amount',
                formatAmount(contract.amount, contract.currency),
              )}
              {renderRow('Amount Type', contract.amountType)}
              {renderRow('Currency', contract.currency)}
              {renderRow('Contract Date', formatDate(contract.date))}
              {renderRow('Start Date', formatDate(contract.startDate))}
              {renderRow(
                'End Date',
                contract.isLifeTime ? 'Lifetime' : formatDate(contract.endDate),
              )}
              {renderRow('Party', partyLabel, false, true)}
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>
    </div>
  );
};

const ContractPaymentPlanBody = ({ contract }: { contract: IContract }) => {
  const { paymentPlan } = contract;

  if (!paymentPlan) {
    return (
      <div className="text-muted-foreground p-4">
        No payment plan attached to this contract.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="Payment Plan">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              {renderRow('Type', paymentPlan.type, true)}
              {renderRow(
                'Down Payment',
                paymentPlan.downPaymentPercentage != null
                  ? `${paymentPlan.downPaymentPercentage}%`
                  : null,
              )}
              {renderRow(
                'Interest',
                paymentPlan.interestPercentage != null
                  ? `${paymentPlan.interestPercentage}%`
                  : null,
              )}
              {renderRow('Interest Type', paymentPlan.interestType)}
              {renderRow(
                'Advance Payment',
                paymentPlan.advancePaymentPercentage != null
                  ? `${paymentPlan.advancePaymentPercentage}%`
                  : null,
              )}
              {renderRow(
                'Discount',
                paymentPlan.discountPercentage != null
                  ? `${paymentPlan.discountPercentage}%`
                  : null,
              )}
              {renderRow('Installments', paymentPlan.installment)}
              {renderRow('Frequency', paymentPlan.frequency)}
              {renderRow(
                'Payment Dates',
                paymentPlan.paymentDates && paymentPlan.paymentDates.length
                  ? paymentPlan.paymentDates.join(', ')
                  : null,
              )}
              {renderRow(
                'Penalty',
                paymentPlan.penaltyPercentage != null
                  ? `${paymentPlan.penaltyPercentage}%`
                  : null,
              )}
              {renderRow('Description', paymentPlan.description)}
              {renderRow(
                'VAT Included',
                paymentPlan.vatIncluded ? 'Yes' : 'No',
                false,
                true,
              )}
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      <PaymentSchedule contract={contract} />
    </div>
  );
};

const parseDateLike = (value: any): Date | null => {
  if (!value) return null;
  const num = Number(value);
  const d = new Date(isNaN(num) ? value : num);
  return isNaN(d.getTime()) ? null : d;
};

const setSafeDay = (date: Date, day: number) => {
  const d = new Date(date);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));
  return d;
};

function generateInstallmentDates(
  startDate: Date,
  count: number,
  frequency: string | undefined,
  paymentDates: number[],
): Date[] {
  const dates: Date[] = [];
  const days = paymentDates.length ? paymentDates : [15];

  const addMonths = (base: Date, months: number) => {
    const d = new Date(base);
    d.setMonth(d.getMonth() + months);
    return d;
  };
  const addYears = (base: Date, years: number) => {
    const d = new Date(base);
    d.setFullYear(d.getFullYear() + years);
    return d;
  };

  switch (frequency) {
    case 'ONE_TIME_PER_MONTH': {
      for (let i = 0; i < count; i++) {
        dates.push(setSafeDay(addMonths(startDate, i + 1), days[0]));
      }
      break;
    }
    case 'TWO_TIME_PER_MONTH': {
      const dd = days.length >= 2 ? days.slice(0, 2) : [15, 30];
      const monthsNeeded = Math.ceil(count / 2);
      for (let m = 0; m < monthsNeeded; m++) {
        for (let i = 0; i < dd.length && dates.length < count; i++) {
          dates.push(setSafeDay(addMonths(startDate, m + 1), dd[i]));
        }
      }
      break;
    }
    case 'THREE_TIME_PER_MONTH': {
      const dd = days.length >= 3 ? days.slice(0, 3) : [10, 20, 30];
      const monthsNeeded = Math.ceil(count / 3);
      for (let m = 0; m < monthsNeeded; m++) {
        for (let i = 0; i < dd.length && dates.length < count; i++) {
          dates.push(setSafeDay(addMonths(startDate, m + 1), dd[i]));
        }
      }
      break;
    }
    case 'QUARTERLY': {
      for (let i = 0; i < count; i++) {
        dates.push(setSafeDay(addMonths(startDate, (i + 1) * 3), days[0]));
      }
      break;
    }
    case 'HALF_YEARLY': {
      for (let i = 0; i < count; i++) {
        dates.push(setSafeDay(addMonths(startDate, (i + 1) * 6), days[0]));
      }
      break;
    }
    case 'YEARLY': {
      for (let i = 0; i < count; i++) {
        dates.push(setSafeDay(addYears(startDate, i + 1), days[0]));
      }
      break;
    }
    case 'ONE_TIME': {
      break;
    }
    default: {
      for (let i = 0; i < count; i++) {
        dates.push(setSafeDay(addMonths(startDate, i + 1), days[0]));
      }
    }
  }
  return dates;
}

const PaymentSchedule = ({ contract }: { contract: IContract }) => {
  const { paymentPlan, amount, currency } = contract;
  if (!paymentPlan) return null;

  const totalPrice = amount || 0;
  const downPct = paymentPlan.downPaymentPercentage || 0;
  const frequency = paymentPlan.frequency;
  const isOneTime = frequency === 'ONE_TIME';
  const installmentCount = isOneTime
    ? 0
    : Math.max(0, paymentPlan.installment || 0);

  if (!totalPrice && installmentCount === 0 && !isOneTime) return null;

  const downAmount = (totalPrice * downPct) / 100;
  const installmentPct =
    installmentCount > 0 ? (100 - downPct) / installmentCount : 0;
  const installmentAmount = (totalPrice * installmentPct) / 100;

  const startDate =
    parseDateLike(contract.startDate) ||
    parseDateLike(contract.date) ||
    new Date();
  const installmentDates = generateInstallmentDates(
    startDate,
    installmentCount,
    frequency,
    paymentPlan.paymentDates || [],
  );

  const contractDateStr = formatDate(contract.date) || '-';

  const fmt = (val: number) =>
    new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: currency || 'MNT',
      minimumFractionDigits: 0,
    }).format(val);

  const Header = ({ children }: { children: React.ReactNode }) => (
    <div className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase">
      {children}
    </div>
  );
  const Cell = ({ children }: { children: React.ReactNode }) => (
    <div className="px-2 py-2 border-t text-sm">{children}</div>
  );

  return (
    <InfoCard title="Payment Schedule">
      <InfoCard.Content className="shadow-none p-0 overflow-hidden">
        <div className="grid grid-cols-5 bg-sidebar">
          <Header>Payment</Header>
          <Header>Date</Header>
          <Header>Type</Header>
          <Header>%</Header>
          <Header>Amount</Header>
        </div>
        {isOneTime ? (
          <div className="grid grid-cols-5">
            <Cell>Full payment</Cell>
            <Cell>{contractDateStr}</Cell>
            <Cell>One-time</Cell>
            <Cell>100%</Cell>
            <Cell>{fmt(totalPrice)}</Cell>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5">
              <Cell>Reservation</Cell>
              <Cell>{contractDateStr}</Cell>
              <Cell>Down payment</Cell>
              <Cell>{downPct}%</Cell>
              <Cell>{fmt(downAmount)}</Cell>
            </div>
            {Array.from({ length: installmentCount }).map((_, index) => {
              const isLast = index === installmentCount - 1;
              const date = installmentDates[index];
              return (
                <div key={index} className="grid grid-cols-5">
                  <Cell>Installment {index + 1}</Cell>
                  <Cell>
                    {date
                      ? format(date, 'dd.MM.yyyy')
                      : isLast
                      ? 'Key handover'
                      : '-'}
                  </Cell>
                  <Cell>
                    {isLast ? 'Final payment' : 'Progress payment'}
                  </Cell>
                  <Cell>
                    {installmentPct.toFixed(2).replace('.00', '')}%
                  </Cell>
                  <Cell>{fmt(installmentAmount)}</Cell>
                </div>
              );
            })}
          </>
        )}
        <div className="grid grid-cols-5 bg-sidebar border-t font-medium">
          <Cell>Total</Cell>
          <Cell> </Cell>
          <Cell> </Cell>
          <Cell>100%</Cell>
          <Cell>{fmt(totalPrice)}</Cell>
        </div>
      </InfoCard.Content>
    </InfoCard>
  );
};

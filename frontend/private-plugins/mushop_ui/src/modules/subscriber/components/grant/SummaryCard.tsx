import { InfoCard } from 'erxes-ui';
import { GrantSheetState } from '../../hooks/useGrantSheetState';
import {
  daysBetween,
  formatDate,
  formatMoney,
} from '../../utils/grantHelpers';
import { CustomerName } from './CustomerName';
import { Row } from './Row';
import { Timeline } from './Timeline';

export const SummaryCard = ({
  customerId,
  activeSub,
  selectedPlan,
  isExtending,
  isSamePlan,
  previewEndDate,
}: Pick<
  GrantSheetState,
  | 'customerId'
  | 'activeSub'
  | 'selectedPlan'
  | 'isExtending'
  | 'isSamePlan'
  | 'previewEndDate'
>) => {
  const showCurrent = isExtending && !selectedPlan && activeSub;
  const showSummary = !isExtending || selectedPlan;

  return (
    <InfoCard title={showCurrent ? 'Current subscription' : 'Summary'}>
      <InfoCard.Content>
        <div className="flex flex-col text-sm">
          {showCurrent && activeSub && (
            <>
              <Row label="Customer">
                {customerId ? (
                  <CustomerName customerId={customerId} />
                ) : (
                  '—'
                )}
              </Row>
              <Row label="Plan">
                {activeSub.plan
                  ? `${activeSub.plan.name} · ${
                      activeSub.plan.durationMonths ?? '-'
                    } mo`
                  : '—'}
              </Row>
              <Row label="Period">
                {formatDate(activeSub.startDate)} →{' '}
                {formatDate(activeSub.endDate)}
              </Row>
              <Row label="Time left">
                {(() => {
                  if (!activeSub.endDate) return '—';
                  const d = daysBetween(
                    new Date(),
                    new Date(activeSub.endDate),
                  );
                  return d <= 0 ? 'Expires today' : `${d} days`;
                })()}
              </Row>
              <Row label="Last paid">
                {formatMoney(activeSub.amount, activeSub.currency)}
              </Row>
            </>
          )}

          {showSummary && (
            <>
              <Row label="Plan">
                {selectedPlan ? (
                  <span className="text-primary">
                    {selectedPlan.name}
                    {isExtending && !isSamePlan && (
                      <span className="ml-2 text-[10px] text-emerald-700 uppercase tracking-wide">
                        (change)
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Select a plan</span>
                )}
              </Row>
              <Row label="Duration">
                {selectedPlan?.durationMonths
                  ? `+ ${selectedPlan.durationMonths} months`
                  : '—'}
              </Row>
              {isExtending && activeSub?.endDate && (
                <Row label="Current end">
                  <span className="text-muted-foreground line-through">
                    {formatDate(activeSub.endDate)}
                  </span>
                </Row>
              )}
              <Row label="New end">
                {previewEndDate ? (
                  <span className="text-primary">
                    {formatDate(previewEndDate.toISOString())}
                  </span>
                ) : (
                  '—'
                )}
              </Row>
            </>
          )}
        </div>

        {showCurrent && activeSub?.startDate && activeSub.endDate && (
          <Timeline
            start={new Date(activeSub.startDate)}
            end={new Date(activeSub.endDate)}
          />
        )}

        {showSummary && selectedPlan && previewEndDate && (
          <Timeline
            start={
              isExtending && activeSub?.startDate
                ? new Date(activeSub.startDate)
                : new Date()
            }
            end={previewEndDate}
          />
        )}
      </InfoCard.Content>
    </InfoCard>
  );
};

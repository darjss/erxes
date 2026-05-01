import { ActivityLogCustomActivity, TActivityLog } from 'ui-modules';
import { ActivityLogs } from 'ui-modules';

const Sentence = ({ children }: { children: React.ReactNode }) => (
  <span className="flex flex-wrap items-center gap-1 text-sm">{children}</span>
);

const Muted = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground">{children}</span>
);

const CreatedRow = ({ activity }: { activity: TActivityLog }) => (
  <Sentence>
    <ActivityLogs.ActorName activity={activity} />
    <Muted>created plan</Muted>
    {activity.changes?.name && (
      <span className="font-medium">"{activity.changes.name}"</span>
    )}
    {activity.changes?.price != null && (
      <Muted>
        · {activity.changes.price.toLocaleString()} {activity.changes.currency} / {activity.changes.durationMonths}mo
      </Muted>
    )}
  </Sentence>
);

const UpdatedRow = ({ activity }: { activity: TActivityLog }) => {
  const prev = activity.changes?.prev;
  const current = activity.changes?.current;

  const changedFields = prev && current
    ? Object.keys(current).filter(
        (k) => JSON.stringify(prev[k]) !== JSON.stringify(current[k]),
      )
    : [];

  return (
    <Sentence>
      <ActivityLogs.ActorName activity={activity} />
      <Muted>updated plan</Muted>
      {current?.name && <span className="font-medium">"{current.name}"</span>}
      {changedFields.length > 0 && (
        <Muted>· changed {changedFields.join(', ')}</Muted>
      )}
    </Sentence>
  );
};

const DeactivatedRow = ({ activity }: { activity: TActivityLog }) => (
  <Sentence>
    <ActivityLogs.ActorName activity={activity} />
    <Muted>deactivated plan</Muted>
  </Sentence>
);

export const subscriptionPlanCustomActivities: ActivityLogCustomActivity[] = [
  {
    type: 'subscription_plan.created',
    render: (activity) => <CreatedRow activity={activity} />,
  },
  {
    type: 'subscription_plan.updated',
    render: (activity) => <UpdatedRow activity={activity} />,
  },
  {
    type: 'subscription_plan.deactivated',
    render: (activity) => <DeactivatedRow activity={activity} />,
  },
];

import { ActivityLogCustomActivity, TActivityLog } from 'ui-modules';
import { ActivityLogs } from 'ui-modules';

const Sentence = ({ children }: { children: React.ReactNode }) => (
  <span className="flex flex-wrap items-center gap-1 text-sm">{children}</span>
);

const Muted = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground">{children}</span>
);

const Bold = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium">{children}</span>
);

const CreatedRow = ({ activity }: { activity: TActivityLog }) => (
  <Sentence>
    <ActivityLogs.ActorName activity={activity} />
    <Muted>activated subscription</Muted>
    {activity.changes?.planId && (
      <Bold>plan {activity.changes.planId}</Bold>
    )}
    {activity.changes?.amount != null && (
      <Muted>· {activity.changes.amount.toLocaleString()} {activity.changes.currency || 'MNT'}</Muted>
    )}
  </Sentence>
);

const ExtendedRow = ({ activity }: { activity: TActivityLog }) => {
  const prev = activity.changes?.prev?.endDate;
  const current = activity.changes?.current?.endDate;
  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '?';

  return (
    <Sentence>
      <ActivityLogs.ActorName activity={activity} />
      <Muted>renewed subscription</Muted>
      {prev && current && (
        <Muted>· {fmt(prev)} → {fmt(current)}</Muted>
      )}
    </Sentence>
  );
};

const CancelledRow = ({ activity }: { activity: TActivityLog }) => (
  <Sentence>
    <ActivityLogs.ActorName activity={activity} />
    <Muted>cancelled subscription</Muted>
  </Sentence>
);

const ExpiredRow = ({ activity }: { activity: TActivityLog }) => {
  const endDate = activity.changes?.endDate || activity.metadata?.endDate;
  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : null;

  return (
    <Sentence>
      <Muted>Subscription expired</Muted>
      {fmt(endDate) && <Muted>on {fmt(endDate)}</Muted>}
    </Sentence>
  );
};

export const subscriptionCustomActivities: ActivityLogCustomActivity[] = [
  {
    type: 'subscription.created',
    render: (activity) => <CreatedRow activity={activity} />,
  },
  {
    type: 'subscription.extended',
    render: (activity) => <ExtendedRow activity={activity} />,
  },
  {
    type: 'subscription.cancelled',
    render: (activity) => <CancelledRow activity={activity} />,
  },
  {
    type: 'subscription.expired',
    render: (activity) => <ExpiredRow activity={activity} />,
  },
];

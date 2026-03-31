import { Empty, Spinner } from 'erxes-ui';
import { useActivities } from '../hooks/useActivities';
import { ActivityItemWrapper } from './ActivityItemWrapper';
import { NoteInput } from './NoteInput';
import { IconNote } from '@tabler/icons-react';

export const OPPTY_ACTIVITY_LABELS: Record<string, string> = {
  PRIORITY: 'Priority',
  ASSIGNED_USER: 'Assigned User',
  BLOCK: 'Block',
  STATUS: 'Status',
  LABEL: 'Label',
  TAG: 'Tag',
  PROJECT: 'Project',
  UNIT_TYPE: 'Unit Type',
  UNITS: 'Units',
  UNIT: 'Unit',
  START_DATE: 'Start Date',
  TARGET_DATE: 'Target Date',
  NOTE: 'Note',
};

export const ActivityList = ({
  contentId,
  contentType,
  labels = OPPTY_ACTIVITY_LABELS,
}: {
  contentId: string;
  contentType: 'oppty';
  labels?: Record<string, string>;
}) => {
  const { activities, loading } = useActivities(contentId);

  if (loading) return <Spinner containerClassName="py-10" />;

  return (
    <div className="flex flex-col mb-12 gap-4">
      <div className="bt:ml-2.5 relative before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-muted before:-translate-x-1/2 flex flex-col gap-6">
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityItemWrapper
              key={activity._id}
              activity={activity}
              labels={labels}
            />
          ))
        ) : (
          <Empty>
            <Empty.Media variant="icon">
              <IconNote />
            </Empty.Media>
            <Empty.Title>No activities found</Empty.Title>
            <Empty.Description>
              No activities found for this {contentType}.
            </Empty.Description>
          </Empty>
        )}
      </div>
      <span className="ml-2.5 mb-6">
        <NoteInput contentId={contentId} contentType={contentType} />
      </span>
    </div>
  );
};

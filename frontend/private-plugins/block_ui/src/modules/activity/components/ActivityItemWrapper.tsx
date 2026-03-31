import { IActivity } from '../types/activityTypes';
import { IconNote, IconPencil } from '@tabler/icons-react';
import { ActivityItem } from './ActivityItem';

export const ActivityItemWrapper = ({
  activity,
  labels,
}: {
  activity: IActivity;
  labels: Record<string, string>;
}) => {
  return (
    <ActivityTimelineItem
      avatar={
        activity.module === 'NOTE' ? (
          <IconNote className="text-accent-foreground size-4" />
        ) : (
          <IconPencil className="text-accent-foreground size-4" />
        )
      }
      id={activity._id}
    >
      <ActivityItem activity={activity} labels={labels} />
    </ActivityTimelineItem>
  );
};

interface ActivityTimelineItemProps {
  avatar: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}

export const ActivityTimelineItem = ({
  avatar,
  children,
}: ActivityTimelineItemProps) => {
  return (
    <div className="flex gap-1">
      <div className="size-5 bt:-ml-2.5 mt-0.5 shadow-xs rounded-full bg-background relative flex items-center justify-center">
        {avatar}
      </div>
      <div className="flex gap-1 flex-1 text-sm leading-6 flex-wrap ml-1">
        {children}
      </div>
    </div>
  );
};

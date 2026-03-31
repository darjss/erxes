import { BlockEditorReadOnly, RelativeDateDisplay } from 'erxes-ui';
import { useBlockGetNote } from '../hooks/useGetNote';
import { IActivity } from '../types/activityTypes';
import { MembersInline } from 'ui-modules';

export const ActivityItem = ({
  activity,
  labels,
}: {
  activity: IActivity;
  labels: Record<string, string>;
}) => {
  const { blockGetNote, loading } = useBlockGetNote(
    activity.metadata?.newValue,
    activity.module !== 'NOTE',
  );
  const memberIds = activity.createdBy ? [activity.createdBy] : [];
  const createdAt = activity.createdAt;

  if (activity.module === 'NOTE') {
    return (
      <>
        {activity.createdBy === 'system' ? (
          <div className="text-accent-foreground">System</div>
        ) : (
          <MembersInline.Provider memberIds={memberIds}>
            <MembersInline.Title />
          </MembersInline.Provider>
        )}
        {createdAt && (
          <RelativeDateDisplay value={createdAt} asChild>
            <div className="text-accent-foreground cursor-default">
              <RelativeDateDisplay.Value value={createdAt} />
            </div>
          </RelativeDateDisplay>
        )}
        <div className="flex flex-col border rounded-lg min-h-14 px-4 py-3 w-full">
          {!loading && (
            <BlockEditorReadOnly
              content={blockGetNote?.content || ''}
              className="read-only"
            />
          )}
        </div>
      </>
    );
  }

  const isObject = (value: unknown) => {
    try {
      const parsedValue = JSON.parse(String(value));
      return typeof parsedValue === 'object';
    } catch {
      return false;
    }
  };

  return (
    <div className="flex flex-wrap gap-1 text-muted-foreground">
      {activity.createdBy === 'system' ? (
        <div className="text-accent-foreground">System</div>
      ) : (
        <MembersInline.Provider memberIds={memberIds}>
          <MembersInline.Title />
        </MembersInline.Provider>
      )}

      {activity.action.toLowerCase()}
      <span className="text-foreground">
        "{labels[activity.module as keyof typeof labels]}"
      </span>
      {!isObject(activity.metadata?.previousValue) &&
        !isObject(activity.metadata?.newValue) && (
          <>
            from
            <span className="text-foreground">
              "{activity.metadata?.previousValue || 'N/A'}"
            </span>
            to
            <span className="text-foreground">
              "{activity.metadata?.newValue}"
            </span>
          </>
        )}
      {createdAt && (
        <RelativeDateDisplay value={createdAt} asChild>
          <div className="text-accent-foreground cursor-default">
            <RelativeDateDisplay.Value value={createdAt} />
          </div>
        </RelativeDateDisplay>
      )}
    </div>
  );
};

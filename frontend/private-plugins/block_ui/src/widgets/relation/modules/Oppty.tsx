import { ScrollArea, Separator, Spinner } from 'erxes-ui';
import { IconCaretLeftRight } from '@tabler/icons-react';
import { useRelations } from 'ui-modules';

import { OpptyWidgetCard } from './OpptyWidgetCard';

export const Oppty = ({
  contentId,
  contentType,
  customerId,
  companyId,
}: {
  contentId: string;
  contentType: string;
  customerId?: string;
  companyId?: string;
}) => {
  const { ownEntities, loading: loadingRelations } = useRelations({
    variables: {
      contentId,
      contentType,
      relatedContentType: 'block:oppty',
    },
  });

  if (loadingRelations) {
    return <Spinner containerClassName="py-20" />;
  }

  if (ownEntities?.length === 0) {
    return (
      <div className="flex flex-col flex-auto justify-center items-center gap-4 text-muted-foreground">
        <div className="bg-background p-6 border border-dashed rounded-xl">
          <IconCaretLeftRight />
        </div>
        <span className="text-sm">
          No opportunities to display at the moment.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-none justify-between items-center gap-2 bg-background px-4 h-11">
        <span className="font-medium text-primary">Opportunities</span>
      </div>
      <Separator />
      <ScrollArea className="flex-auto">
        <div className="flex flex-col gap-4 p-4">
          {ownEntities?.map((entity) => (
            <OpptyWidgetCard
              key={entity.contentId}
              opptyId={entity.contentId}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

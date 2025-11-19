import { Badge, Spinner, cn } from 'erxes-ui';
import { useNewsDetail } from '../hooks/useNewsDetail';
import { IconClockFilled, IconShieldFilled } from '@tabler/icons-react';
import { NewsDetailName } from './NewsDetailName';
import { NewsDetailActions } from '~/modules/news/components/NewsDetailActions';

export const NewsDetailProfile = () => {
  const { news, loading } = useNewsDetail();

  if (loading) return <Spinner containerClassName="py-12" />;

  return (
    <div className="flex border-b">
      <div className="p-8 space-y-3">
        <div className="flex items-center gap-3">
          <NewsDetailName id={news?._id || ''} name={news?.name || ''} />
          <Badge
            variant={news?.status === 'verified' ? 'default' : 'secondary'}
          >
            <IconShieldFilled
              className={cn(
                'size-3.5',
                news?.status !== 'verified' && 'text-accent-foreground',
              )}
            />
            {news?.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-accent-foreground">
          <IconClockFilled className="size-4" />
          <p className="text-sm">Last updated by Carl Marx, 2024-12-01 14:30</p>
        </div>
      </div>
      <div className="ml-auto p-8">
        <NewsDetailActions />
      </div>
    </div>
  );
};

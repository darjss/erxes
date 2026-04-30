import { Button, Select } from 'erxes-ui';
import { useTranslation } from 'react-i18next';

export const PaginationBar = ({
  page,
  perPage,
  totalCount,
  onPageChange,
  onPerPageChange,
}: {
  page: number;
  perPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}) => {
  const { t } = useTranslation('car');
  const pageCount = Math.max(1, Math.ceil(totalCount / perPage));

  return (
    <div className="flex items-center justify-between border-t bg-sidebar/50 px-3 py-2">
      <div className="text-sm text-muted-foreground">
        {t('Total count', {
          count: totalCount,
          defaultValue: '{{count}} total',
        })}
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={String(perPage)}
          onValueChange={(value) => onPerPageChange(Number(value))}
        >
          <Select.Trigger className="w-24">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {[10, 20, 40, 60].map((size) => (
              <Select.Item key={size} value={String(size)}>
                {t('per page', {
                  count: size,
                  defaultValue: '{{count}} / page',
                })}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {t('Previous', { defaultValue: 'Previous' })}
        </Button>
        <div className="min-w-28 text-center text-sm font-medium">
          {t('Page {{page}} of {{pageCount}}', {
            page,
            pageCount,
            defaultValue: 'Page {{page}} of {{pageCount}}',
          })}
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          {t('Next', { defaultValue: 'Next' })}
        </Button>
      </div>
    </div>
  );
};

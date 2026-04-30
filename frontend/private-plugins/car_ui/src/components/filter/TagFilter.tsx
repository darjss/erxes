import { Combobox, Button } from 'erxes-ui';
import { IconTags, IconX } from '@tabler/icons-react';
import { TagsSelect } from 'ui-modules';
import { useTranslation } from 'react-i18next';

import { ROOT_CAR_CONTENT_TYPE } from '~/lib/constants';

export const TagFilter = ({
  value,
  onValueChange,
}: {
  value: string | null;
  onValueChange: (value: string | null) => void;
}) => {
  const { t } = useTranslation('car');

  return (
    <TagsSelect.Provider
      mode="single"
      type={ROOT_CAR_CONTENT_TYPE}
      value={value || undefined}
      onValueChange={(nextValue) =>
        onValueChange((nextValue as string) || null)
      }
    >
      <div className="flex items-center gap-2">
        {!value ? (
          <TagsSelect.Trigger
            variant="secondary"
            size="sm"
            placeholder={t('Tag', { defaultValue: 'Tag' })}
          />
        ) : (
          <>
            <div className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5">
              <IconTags className="size-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                <TagsSelect.SelectedList renderAsPlainText />
              </div>
            </div>
            <TagsSelect.Trigger
              variant="secondary"
              size="sm"
              placeholder={t('Change tag', { defaultValue: 'Change tag' })}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onValueChange(null)}
            >
              <IconX className="size-4" />
            </Button>
          </>
        )}
        <Combobox.Content className="w-80">
          <TagsSelect.Content />
        </Combobox.Content>
      </div>
    </TagsSelect.Provider>
  );
};
